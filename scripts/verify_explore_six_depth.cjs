#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const parser = require('@babel/parser');
for (const file of ['resources/js/components/ExploreSixDepth.jsx','resources/js/components/ExploreDeepExperience.jsx','resources/js/Pages/ExploreLifeLanguage.jsx']) {
 parser.parse(fs.readFileSync(file,'utf8'),{sourceType:'module',plugins:['jsx']});
 console.log('JSX OK:',file);
}
const source = fs.readFileSync('resources/js/components/ExploreSixDepth.jsx','utf8');
const router = fs.readFileSync('resources/js/components/ExploreDeepExperience.jsx','utf8');
const expected = {
 beliefs:'BeliefsDepth',values:'ValuesDepth',fears:'FearsDepth',
 time:'TimeDepth',conflicts:'ConflictsDepth',attention:'AttentionDepth'
};
const used = new Set();
for (const [slug,component] of Object.entries(expected)) {
 const data = JSON.parse(fs.readFileSync('resources/data/'+slug+'-atlas.json','utf8'));
 if(data.situations?.length!==10) throw Error(slug+': expected 10 scenarios');
 if (!source.includes('function '+component+'(') || !router.includes(slug+':'+component))
  throw Error(slug+': unique interactive component missing');
 let count=0;
 for(const scenario of data.situations){
  if(scenario.options?.length!==3) throw Error(slug+': expected 3 options '+scenario.id);
  for(const option of scenario.options){
   const d=option.deep;
   if(!d?.consequence || !d?.step || d.consequence.length<55 || d.step.length<45) throw Error(slug+': shallow outcome '+scenario.id+' '+option.id);
   const key=d.consequence.trim().toLowerCase();
   if(used.has(key)) throw Error('Repeated explanation: '+slug+' '+scenario.id);
   used.add(key);count++;
  }
 }
 console.log(slug+': '+count+' individual detailed explanations');
}
if(used.size!==180) throw Error('Expected 180 distinct analyses, got '+used.size);
console.log('ПРОВЕРКА ШЕСТИ НАПРАВЛЕНИЙ ПРОЙДЕНА: 180 разных разборов.');
