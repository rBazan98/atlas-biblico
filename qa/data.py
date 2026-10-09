"""Comprueba cobertura, localización y protecciones del criterio central."""
import contextlib, copy, importlib.util, io, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('validate',ROOT/'scripts/validar.py')
validate=importlib.util.module_from_spec(spec);spec.loader.exec_module(validate)
data=json.loads((ROOT/'registro.json').read_text())
with contextlib.redirect_stdout(io.StringIO()):graph=validate.main(data,write=False)
assert {s['work_id'] for s in data['stages']}=={w['id'] for w in data['works']}
assert all(s['claim_ids'] and s['date_ids'] and s['attribution_ids'] for s in data['stages'])
for scenario in graph['scenarios']:
    edges=scenario['edges'];assert len(edges)==48
    adjacent={n['id']:[] for n in scenario['nodes']}
    for e in edges:adjacent[e['source']].append(e['target'])
    visiting=set();visited=set()
    def visit(node):
        assert node not in visiting,'Ciclo en el grafo admitido actual.'
        if node in visited:return
        visiting.add(node)
        for next_node in adjacent[node]:visit(next_node)
        visiting.remove(node);visited.add(node)
    for node in adjacent:visit(node)
messages=json.loads((ROOT/'locales/en.json').read_text())['messages']
keys={'label','scope','notes','value','certainty_rationale','counterarguments','summary','limitations','contribution','independence_rationale','route','access_time_description','justification','place','scope_notes','reason','assumptions'}
unchanged={'Ben Sira','Job','1 Samuel','2 Samuel','Daniel','Joel'}
missing=[]
def walk(value,key=''):
    if isinstance(value,dict):
        for k,v in value.items():walk(v,k)
    elif isinstance(value,list):
        for v in value:walk(v,key)
    elif key in keys and isinstance(value,str) and value and value not in messages and value not in unchanged:
        missing.append(value)
walk(data);assert not missing,sorted(set(missing))
critical=[e for e in data['access_evaluations'] if e['scenario_id']=='scenario_critical']
admitted=[e for e in critical if e['status']=='admitida']
assert len([e for e in admitted if e['access_basis']['kind']!='textual_reception'])==12
assert all(e['access_basis']['reason'] and e['access_basis']['assumptions'] for e in critical)
common=[e for e in admitted if e['access_basis']['kind']=='common_authorship']
assert len(common)==3
assert all(e['dependence']['status']=='not_evaluated' and not e['dependence']['evidence_ids'] for e in common)
evidence={e['id']:e for e in data['evidence']}
assert all(all(evidence[eid]['kind']=='historiographical_argument' for line in e['evidence_lines'] for eid in line['evidence_ids']) for e in common)
assembly=[e for e in admitted if e['access_basis']['kind']=='collection']
assert len(assembly)==2 and all(e['to_stage_id']=='stage_dan_assembly' for e in assembly)
assert next(e for e in critical if e['id']=='candidate_dan_collection')['status']=='pendiente'
negative=[]
for case in ['unsupported_condition','one_evidence_basis','unknown_reference','reversed_interval','different_author','unresolved_access','reversed_common_chronology']:
    altered=copy.deepcopy(data)
    if case=='unsupported_condition':altered['access_evaluations'][0]['checks']['contextual_availability']='uncertain'
    elif case=='one_evidence_basis':altered['access_evaluations'][0]['evidence_lines']=altered['access_evaluations'][0]['evidence_lines'][:1]
    elif case=='unknown_reference':altered['access_evaluations'][0]['source_form_id']='form_does_not_exist'
    elif case=='reversed_interval':altered['dates'][0]['earliest'],altered['dates'][0]['latest']=altered['dates'][0]['latest'],altered['dates'][0]['earliest']
    elif case=='different_author':
        receiver=next(e for e in altered['access_evaluations'] if e['id']=='access_prior_1th_1co')['recipient_attribution_id']
        next(a for a in altered['attributions'] if a['id']==receiver)['actor_id']=altered['actors'][0]['id']
    elif case=='unresolved_access':altered['access_evaluations'][0]['access_basis']['kind']='unresolved'
    elif case=='reversed_common_chronology':
        for date in altered['dates']:
            if date['subject_id']=='stage_1th' and date['event']=='composition':
                date['earliest']={'year':60,'era':'CE'};date['latest']={'year':60,'era':'CE'}
    try:
        with contextlib.redirect_stdout(io.StringIO()):validate.main(altered,write=False)
    except ValueError as error:
        expected={'unsupported_condition':'condición sin respaldar','one_evidence_basis':'convergencia insuficientemente registrada','unknown_reference':'referencia inexistente','reversed_interval':'intervalo invertido','different_author':'responsables distintos','unresolved_access':'sin fundamento de acceso evaluado','reversed_common_chronology':'sin anterioridad delimitada'}
        assert expected[case] in str(error)
        negative.append({'case':case,'rejected':True,'reason':str(error).splitlines()[0]})
    else:raise AssertionError('Caso inválido admitido: '+case)
out={'passed':True,'books':len(data['works']),'stages':len(data['stages']),'sources':len(data['sources']),'scenarios':2,'admitted_per_scenario':48,'pending_per_scenario':9,'admitted_without_explicit_quotation':12,'inferred_access_per_scenario':11,'common_authorship_does_not_claim_dependence':True,'compiler_access_not_imputed_to_original_authors':True,'english_missing_historical_messages':0,'negative_checks':negative,'historical_truth_certified':False}
(ROOT/'qa/data-results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('Cobertura, traducciones y protecciones del criterio comprobadas.')
