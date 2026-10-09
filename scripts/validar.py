"""Valida el registro y deriva el grafo por escenario; no evalúa verdad histórica."""

import json
from collections import Counter
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
COLLECTIONS = [
    'works', 'actors', 'stages', 'attributions', 'forms', 'contexts',
    'dates', 'claims', 'evidence', 'sources', 'scenarios', 'access_evaluations',
]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def chronological_year(bound):
    return bound['year'] if bound['era'] == 'CE' else 1 - bound['year']


def main(data=None, write=True):
    data = data if data is not None else json.loads((ROOT / 'registro.json').read_text(encoding='utf-8'))
    schema = json.loads((ROOT / 'research' / 'schema.json').read_text(encoding='utf-8'))
    Draft202012Validator.check_schema(schema)
    Draft202012Validator(schema, format_checker=FormatChecker()).validate(data)

    identifiers = [entry['id'] for name in COLLECTIONS for entry in data[name]]
    require(len(identifiers) == len(set(identifiers)), 'Identificadores duplicados.')
    all_ids = set(identifiers)
    tables = {name: {entry['id']: entry for entry in data[name]} for name in COLLECTIONS}

    def references(ids, collection, owner):
        for identifier in ids:
            require(identifier in tables[collection], f'{owner}: referencia inexistente {identifier} en {collection}.')

    require(len(data['works']) == 73, 'El catálogo inicial debe contener 73 libros.')
    require(Counter(w['testament'] for w in data['works']) == {'AT': 46, 'NT': 27}, 'Distribución del corpus incorrecta.')
    require(sorted(w['canonical_order'] for w in data['works']) == list(range(1, 74)), 'Orden canónico duplicado o incompleto.')
    require({w['id'] for w in data['works'] if w['deuterocanonical_book']} ==
            {'book_tob', 'book_jdt', 'book_1ma', 'book_2ma', 'book_wis', 'book_sir', 'book_bar'},
            'Revisar el registro de libros deuterocanónicos.')

    for actor in data['actors']:
        for key in ['life_date_ids', 'activity_date_ids']:
            references(actor[key], 'dates', actor['id'])
        references(actor['claim_ids'], 'claims', actor['id'])
    for context in data['contexts']:
        references(context['claim_ids'], 'claims', context['id'])
    for stage in data['stages']:
        references([stage['work_id']], 'works', stage['id'])
        for key, target in [('attribution_ids', 'attributions'), ('date_ids', 'dates'),
                            ('context_ids', 'contexts'), ('claim_ids', 'claims')]:
            references(stage[key], target, stage['id'])
        for aid in stage['attribution_ids']:
            require(tables['attributions'][aid]['stage_id'] == stage['id'], f'{stage["id"]}: atribución de otra etapa.')
        for did in stage['date_ids']:
            require(tables['dates'][did]['subject_id'] == stage['id'], f'{stage["id"]}: fecha de otra entidad.')
    for attribution in data['attributions']:
        references([attribution['stage_id']], 'stages', attribution['id'])
        references([attribution['actor_id']], 'actors', attribution['id'])
        references(attribution['claim_ids'], 'claims', attribution['id'])
        require(attribution['id'] in tables['stages'][attribution['stage_id']]['attribution_ids'],
                f'{attribution["id"]}: falta vínculo inverso con la etapa.')
    for form in data['forms']:
        references([form['stage_id']], 'stages', form['id'])
        references(form['existence_date_ids'], 'dates', form['id'])
        references(form['availability_claim_ids'], 'claims', form['id'])
    for date in data['dates']:
        require(date['subject_id'] in all_ids, f'{date["id"]}: sujeto inexistente.')
        references(date['claim_ids'], 'claims', date['id'])
        if date['earliest'] is not None and date['latest'] is not None:
            lo, hi = chronological_year(date['earliest']), chronological_year(date['latest'])
            require(lo <= hi, f'{date["id"]}: intervalo invertido.')
            require(lo != hi or (date['earliest_inclusive'] and date['latest_inclusive']),
                    f'{date["id"]}: intervalo vacío.')
        if date['kind'] == 'lower_bound':
            require(date['earliest'] is not None and date['latest'] is None, f'{date["id"]}: límite inferior mal definido.')
        if date['kind'] == 'upper_bound':
            require(date['earliest'] is None and date['latest'] is not None, f'{date["id"]}: límite superior mal definido.')
        if date['kind'] == 'estimated_point':
            require(date['earliest'] is not None and date['earliest'] == date['latest'], f'{date["id"]}: punto mal definido.')
    for claim in data['claims']:
        require(claim['subject_id'] in all_ids, f'{claim["id"]}: sujeto inexistente.')
        references(claim['evidence_ids'], 'evidence', claim['id'])
    for evidence in data['evidence']:
        references([c['source_id'] for c in evidence['citations']], 'sources', evidence['id'])
        references(evidence['supports_claim_ids'], 'claims', evidence['id'])
        expected = {c['id'] for c in data['claims'] if evidence['id'] in c['evidence_ids']}
        require(set(evidence['supports_claim_ids']) == expected, f'{evidence["id"]}: vínculos con afirmaciones inconsistentes.')
    for scenario in data['scenarios']:
        for key, target in [('active_stage_ids', 'stages'), ('selected_attribution_ids', 'attributions'),
                            ('selected_date_ids', 'dates'), ('selected_claim_ids', 'claims')]:
            references(scenario[key], target, scenario['id'])
        for aid in scenario['selected_attribution_ids']:
            require(tables['attributions'][aid]['stage_id'] in scenario['active_stage_ids'],
                    f'{scenario["id"]}: atribución de etapa inactiva.')

    evaluated_keys = set()
    for evaluation in data['access_evaluations']:
        owner = evaluation['id']
        references([evaluation['from_stage_id'], evaluation['to_stage_id']], 'stages', owner)
        references([evaluation['source_form_id']], 'forms', owner)
        references([evaluation['recipient_attribution_id']], 'attributions', owner)
        references([evaluation['scenario_id']], 'scenarios', owner)
        require(evaluation['from_stage_id'] != evaluation['to_stage_id'], f'{owner}: subdividir el alcance para evitar autorreferencia.')
        form = tables['forms'][evaluation['source_form_id']]
        attribution = tables['attributions'][evaluation['recipient_attribution_id']]
        scenario = tables['scenarios'][evaluation['scenario_id']]
        require(form['stage_id'] == evaluation['from_stage_id'], f'{owner}: forma de otro origen.')
        require(attribution['stage_id'] == evaluation['to_stage_id'], f'{owner}: responsable de otro destino.')
        require(evaluation['recipient_attribution_id'] in scenario['selected_attribution_ids'], f'{owner}: atribución no seleccionada.')
        require({evaluation['from_stage_id'], evaluation['to_stage_id']} <= set(scenario['active_stage_ids']), f'{owner}: etapa inactiva.')
        key = (evaluation['from_stage_id'], evaluation['to_stage_id'], evaluation['source_form_id'],
               evaluation['recipient_attribution_id'], evaluation['scenario_id'], evaluation['scope'])
        require(key not in evaluated_keys, f'{owner}: evaluación duplicada para el mismo alcance.')
        evaluated_keys.add(key)
        for evidence_ids in evaluation['check_evidence'].values():
            references(evidence_ids, 'evidence', owner)
        references(evaluation['dependence']['evidence_ids'], 'evidence', owner)
        for line in evaluation['evidence_lines']:
            references(line['evidence_ids'], 'evidence', owner)
            require(all(tables['evidence'][eid]['basis_id'] == line['basis_id'] for eid in line['evidence_ids']),
                    f'{owner}: una línea agrupa fundamentos diferentes sin documentarlo.')
        if evaluation['status'] == 'admitida':
            basis = evaluation['access_basis']
            require(basis['kind'] != 'unresolved', f'{owner}: admisión sin fundamento de acceso evaluado.')
            require(bool(basis['reason'].strip()), f'{owner}: falta justificar accesibilidad.')
            require(all(value == 'supported' for value in evaluation['checks'].values()), f'{owner}: admisión con condición sin respaldar.')
            require(all(evaluation['check_evidence'].values()), f'{owner}: condición sin referencias.')
            bases = {line['basis_id'] for line in evaluation['evidence_lines']}
            require(len(bases) >= data['policy']['minimum_evidence_lines'], f'{owner}: convergencia insuficientemente registrada.')
            for field in ['independence_rationale', 'route', 'scope', 'access_time_description', 'justification']:
                require(bool(evaluation[field].strip()), f'{owner}: falta {field}.')
            if basis['kind'] == 'common_authorship':
                source_actors = {tables['attributions'][aid]['actor_id'] for aid in scenario['selected_attribution_ids']
                                 if tables['attributions'][aid]['stage_id'] == evaluation['from_stage_id']}
                require(attribution['actor_id'] in source_actors, f'{owner}: autoría común con responsables distintos.')
                earlier = [tables['dates'][did] for did in scenario['selected_date_ids']
                           if tables['dates'][did]['subject_id'] == evaluation['from_stage_id'] and tables['dates'][did]['event'] == 'composition']
                receiving = [tables['dates'][did] for did in scenario['selected_date_ids']
                             if tables['dates'][did]['subject_id'] == evaluation['to_stage_id'] and tables['dates'][did]['event'] == 'composition']
                require(any(a['latest'] and b['earliest'] and chronological_year(a['latest']) < chronological_year(b['earliest'])
                            for a in earlier for b in receiving), f'{owner}: autoría común sin anterioridad delimitada; registrar otra justificación temporal.')
        if evaluation['status'] == 'incompatible':
            require('incompatible' in evaluation['checks'].values(), f'{owner}: falta identificar la incompatibilidad.')

    graph = {'schema_version': data['schema_version'], 'edge_semantics': data['policy']['edge_semantics'], 'scenarios': []}
    for scenario in data['scenarios']:
        admitted = [e for e in data['access_evaluations'] if e['scenario_id'] == scenario['id'] and e['status'] == 'admitida']
        selected_dates = set(scenario['selected_date_ids'])
        graph['scenarios'].append({
            'id': scenario['id'], 'label': scenario['label'],
            'nodes': [{**tables['stages'][sid],
                       'selected_dates': [tables['dates'][did] for did in tables['stages'][sid]['date_ids'] if did in selected_dates]}
                      for sid in scenario['active_stage_ids']],
            'edges': [{'source': e['from_stage_id'], 'target': e['to_stage_id'],
                       'evaluation_id': e['id'], 'source_form_id': e['source_form_id'], 'scope': e['scope'],
                       'access_basis': e['access_basis']}
                      for e in admitted],
        })
    if write:
        (ROOT / 'research' / 'graph.json').write_text(json.dumps(graph, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    edge_count = sum(len(s['edges']) for s in graph['scenarios'])
    print(f'Validado: {len(data["works"])} libros, {len(data["stages"])} etapas, {len(data["claims"])} afirmaciones y {edge_count} conexión admitida.')
    print('La comprobación verifica documentación y estructura; la admisión histórica requiere valoración de las fuentes.')
    return graph


if __name__ == '__main__':
    main()
