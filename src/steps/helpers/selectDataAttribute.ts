
const dataAttributeSelectorFactory = (dataAttributeName) => {
  const selectorMaker = (name) => `[data-e2e=${name}]`;

  return dataAttributeName
    .split(' ')
    .map(name => selectorMaker(name)).join(' ');
};

const isClassOrId=(selector:string)=>{
  return selector.startsWith('.')
      || selector.startsWith('#')
      || selector.startsWith('[')
      || selector.includes('+')
      || selector.includes('~')
      || selector.includes('*')
      || selector.includes(':')
      || selector.includes('>');
}

const selectorFactory=(selector)=>{
  if(isClassOrId(selector)){
    return selector
  }else{
    return dataAttributeSelectorFactory(selector);
  }
}

const getRandomInt=()=>{
  return Math.floor(Math.random() * 9999) + 1
}

export { selectorFactory ,getRandomInt };
