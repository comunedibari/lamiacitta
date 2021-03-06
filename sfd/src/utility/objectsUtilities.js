/* SPDX-License-Identifier: AGPL-3.0-or-later */
export const isEquivalent = (a, b) => {

    var aNullo = (typeof a === "undefined" || a === null);
    var bNullo = (typeof b === "undefined" || b === null);
  
    if (aNullo === true && bNullo === true) {
      return true;
    }
  
    if (aNullo === false && bNullo === false) {
      // Create arrays of property names
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);
  
      // If number of properties is different,
      // objects are not equivalent
      if (aProps.length !== bProps.length) {
          return false;
      }
  
      for (var i = 0; i < aProps.length; i++) {      
          var propName = aProps[i];
  
          if (typeof a[propName] === "object") {
            return isEquivalent(a[propName], b[propName]);
          }
  
          // If values of same property are not equal,
          // objects are not equivalent
          if (a[propName] !== b[propName]) {
              return false;
          }
      }
  
      // If we made it this far, objects
      // are considered equivalent
      return true;
    }
  
    return false;
  }
  