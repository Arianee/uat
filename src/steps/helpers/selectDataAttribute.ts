
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
      || selector.includes('>')
}

const isTag = (selector: string) => {
  return selector.includes('<')
};

const selectorFactory=(selector)=>{
  if(isClassOrId(selector)){
    return selector
  } else if (isTag(selector)) {
    return selector.replace('<', '')
  } else {
    return dataAttributeSelectorFactory(selector);
  }
}

const getRandomInt=()=>{
  return Math.floor(Math.random() * 9999) + 1
}

export { selectorFactory ,getRandomInt };
