export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}



export function counts(types) {
    var items = [], counts = [], prev;
    var typesAndCounts = []

    for ( var i = 0; i < types.length; i++ ) {
        if ( types[i] !== prev ) {
            items.push(types[i]);
            counts.push(1);
        }
        else {
            counts[counts.length-1]++;
        }
        prev = types[i];
    }
    typesAndCounts.push(items);
    typesAndCounts.push(counts);
    return typesAndCounts;
}

export function objectsInRange(rangeDates, objectsdates, objects) {
  const arr = []
  for (var i1 = 0; i1 < objects.length; i1++) {
    for (var i2 = 0; i2 < rangeDates.length; i2++) {
      if (objectsdates[i1] === rangeDates[i2]) {
        arr.push(objects[i1]);
      }
    }
  }
  return arr;
}
