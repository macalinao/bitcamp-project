db.iapds.find().forEach(function(doc) {
  doc.count = 0;
  if (doc.DRPs) {
    var drp = doc.DRPs.DRP;
    for (var key in drp) {
      if (drp.hasOwnProperty(key)) {
        var val = drp[key];
        if (val === 'Y') {
          doc.count++;
        }
      }
    }
  }
  print(doc.Info['@firstNm'] + ' ' + doc.Info['@lastNm'] + ' - ' + doc.count);
  db.iapds.save(doc);
});
