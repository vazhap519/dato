#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const parser = require('@babel/parser');
const pages = [
'resources/js/Pages/ExploreLifeLanguage.jsx',
'resources/js/Pages/ExploreDreams.jsx',
'resources/js/Pages/ExploreDreamSymbol.jsx',
'resources/js/Pages/ExplorePatterns.jsx',
'resources/js/Pages/ExplorePatternDetail.jsx',
'resources/js/Pages/ExploreEmotionDetail.jsx',
'resources/js/components/ExploreDeepExperience.jsx',
];
for(const name of pages){
  const code=fs.readFileSync(name,'utf8');
  parser.parse(code,{sourceType:'module',plugins:['jsx']});
  if(/(?:>0\{(?:i|index|openedChapter)\+1\}|(?:['"]0[1-9]['"])|>0[1-9]\s*·|padStart\(2,\s*['"]0['"]\))/.test(code)){
    throw Error('Найден ведущий ноль в нумерации: '+name);
  }
  console.log('OK:',name);
}
const page=fs.readFileSync(pages[0],'utf8');
for(const marker of ['role="dialog"','aria-modal="true"','md:hidden','hidden md:block','SituationAnalysis','Разобрать ситуацию']){
 if(!page.includes(marker))throw Error('Отсутствует элемент мобильного разбора: '+marker);
}
for(const removed of ['explore-example-search','setQuery(','const [query,']){
 if(page.includes(removed)) throw Error('Строка поиска не удалена: '+removed);
}
console.log('Мобильное окно, кнопки разбора и естественная нумерация проверены.');
