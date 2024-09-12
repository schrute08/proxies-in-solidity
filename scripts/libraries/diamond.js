/* global ethers */
const { ethers } = require('ethers')
const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 }

// get function selectors from ABI
function getSelectors (contract) {
  // console.log(contract.interface)
  // const functions = contract.interface.fragments.filter(fragment => fragment.type === 'function');
  const interface = new ethers.Interface(contract.interface.fragments)
  const functions = interface.fragments.filter(fragment => fragment.type === 'function')
  // Get the selectors for the function in the selectors array
  const selectors = functions.map(func => {
    return interface.getFunction(func.name).selector
  })
  // const signatures = functions.map(func => {
  //   const inputs = func.inputs.map(input => input.type).join(',');
  //   const signature = `${func.name}(${inputs})`;
  //   return signature;
  // });

  // const selectors = signatures.reduce((acc, val) => {
  //   if (val !== 'init(bytes)') {
  //     acc.push(contract.interface.getSighash(val))
  //   }
  //   return acc
  // }, [])

  // console.log(functions)

  // const selectors = functions.map(func => {
  //   const fragment = contract.interface.getFunction(func.name);
  //   console.log(fragment.format())
  //   console.log(ethers.utils.formatBytes32String(fragment.format()))
  //   console.log(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fragment.format())))
  //   const sighash = ethers.utils.hexDataSlice(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fragment.format())), 0, 4);
  //   return sighash;
  // });

  // const signatures = Object.keys(contract.interface.fragments).map(key => {
  //   const fragment = contract.interface.fragments[key]
  //   if (fragment.type === 'function') {
  //     const inputs = fragment.inputs.map(input => input.type).join(',')
  //     const signature = `${fragment.name}(${inputs})`
  //     return signature
  //   }
  // })
  // const selectors = signatures.reduce((acc, val) => {
  //   if (val !== 'init(bytes)') {
  //     acc.push(contract.interface.getSighash(val))
  //   }
  //   return acc
  // }, [])

  selectors.contract = contract
  selectors.remove = remove
  selectors.get = get
  return selectors
}

// get function selector from function signature
function getSelector (func) {
  const abiInterface = new ethers.utils.Interface([func])
  return abiInterface.getSighash(ethers.utils.Fragment.from(func))
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove (functionNames) {
  const selectors = this.filter((v) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return false
      }
    }
    return true
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get (functionNames) {
  const selectors = this.filter((v) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return true
      }
    }
    return false
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

// remove selectors using an array of signatures
function removeSelectors (selectors, signatures) {
  const iface = new ethers.utils.Interface(signatures.map(v => 'function ' + v))
  const removeSelectors = signatures.map(v => iface.getSighash(v))
  selectors = selectors.filter(v => !removeSelectors.includes(v))
  return selectors
}

// find a particular address position in the return value of diamondLoupeFacet.facets()
function findAddressPositionInFacets (facetAddress, facets) {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i
    }
  }
}

exports.getSelectors = getSelectors
exports.getSelector = getSelector
exports.FacetCutAction = FacetCutAction
exports.remove = remove
exports.removeSelectors = removeSelectors
exports.findAddressPositionInFacets = findAddressPositionInFacets
