"""Genera un dossier legible del registro ya curado, sin inferir nuevas relaciones."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
d=json.loads((ROOT/'registro.json').read_text())
t={k:{x['id']:x for x in d[k]} for k in ['works','actors','attributions','dates','claims','evidence','sources','stages']}
def year(x):return '?' if x is None else str(x['year'])+(' a. C.' if x['era']=='BCE' else ' d. C.')
def dates(s):
    selected=[t['dates'][i] for i in s['date_ids'] if not i.startswith('date_alt_')]
    x=next((x for x in selected if x['event']=='composition'),next((x for x in selected if x['event']=='translation_completion'),selected[0]))
    if x['earliest'] is None and x['latest'] is None:return 'Sin delimitar'
    if x['earliest']==x['latest']:return 'Hacia '+year(x['earliest'])
    return year(x['earliest'])+' — '+year(x['latest'])
lines=['# Dossier del registro bíblico','', 'Registro de trabajo del 6 de octubre de 2026. [Metodología](metodologia.md) · [English methodology](methodology.en.md) · [Justificaciones de acceso](accesibilidad.md). Las fechas indicadas son propuestas; los fundamentos completos y sus condiciones están en el registro y en la aplicación.','', f'{len(d["works"])} libros, {len(d["stages"])} etapas y {len(d["sources"])} referencias. Las introducciones no constituyen una revisión exhaustiva de la bibliografía especializada. Todos los libros conservan estado de investigación parcial.','']
for w in d['works']:
    lines+=['## '+str(w['canonical_order'])+'. '+w['label'],'']
    for s in [s for s in d['stages'] if s['work_id']==w['id']]:
        actor=t['actors'][t['attributions'][s['attribution_ids'][0]]['actor_id']]
        lines+=['**'+s['label']+'** — '+dates(s)+'. '+actor['label']+'.','',s['scope'],'']
        selected=[t['dates'][i] for i in s['date_ids'] if not i.startswith('date_alt_')]
        for date in selected:lines+=[date['notes'],'']
        refs={c['source_id'] for cid in s['claim_ids'] if not cid.startswith(('claim_access_','claim_pending_','claim_alt_')) for eid in t['claims'][cid]['evidence_ids'] for c in t['evidence'][eid]['citations']}
        lines+=['Fuentes: '+', '.join('['+t['sources'][i]['title']+']('+t['sources'][i]['url']+')' for i in sorted(refs))+'.','']
lines+=['## Evaluaciones del escenario crítico','', 'Las mismas relaciones tienen evaluaciones propias bajo las atribuciones alternativas. Cada alcance es limitado; la ausencia de una relación en esta tabla no prueba imposibilidad. Una cita no es requisito para admitir acceso.','', '| Origen | Destino | Estado | Fundamento | Justificación | Supuestos |','| --- | --- | --- | --- | --- | --- |']
for e in d['access_evaluations']:
    if e['scenario_id']=='scenario_critical':
        basis=e['access_basis']
        cells=[t['stages'][e['from_stage_id']]['label'],t['stages'][e['to_stage_id']]['label'],e['status'],basis['label'],basis['reason'],'; '.join(basis['assumptions'])]
        lines+=['| '+' | '.join(x.replace('|','/') for x in cells)+' |']
(ROOT/'docs/registro.md').write_text('\n'.join(lines)+'\n')
report={'version':d['schema_version'],'application_version':(ROOT/'VERSION').read_text().strip(),'schema_version':d['schema_version'],'created_on':json.loads((ROOT/'release.json').read_text())['date'],'data':json.loads((ROOT/'qa/data-results.json').read_text()),'browser':json.loads((ROOT/'qa/browser-results.json').read_text()),'experience':json.loads((ROOT/'qa/experience-results.json').read_text()),'free_exploration':json.loads((ROOT/'qa/explore-results.json').read_text()),'deployment':'Static GitHub Pages files; this validation report does not certify remote publication.','source_captures':'Excluded from distribution; public metadata only.'}
(ROOT/'qa/report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Dossier y reporte generados.')
