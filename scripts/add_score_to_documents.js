db.iapds.find().forEach(function(doc) {
  doc.score = 0;

  if (doc.Exms && doc.Exms.Exm) {
    if (doc.Exms.Exm.length && doc.Exms.Exm.length > 0) {
      doc.score += doc.Exms.Exm.length;
    } else {
      doc.score += 1;
    }
  }

  // Emp
  var emp = (doc.EmpHss || {}).EmpHs;
  if (emp) {
    if (emp.length && emp.length > 0) {
      doc.score += (2015 - parseInt(emp[0]['@fromDt'].split('/')[1])) / 5;
      doc.score += (2015 - parseInt(emp[emp.length - 1]['@fromDt'].split('/')[1])) / 2;
    } else {
      doc.score += (2015 - parseInt(emp['@fromDt'].split('/')[1])) / 5;
      doc.score += (2015 - parseInt(emp['@fromDt'].split('/')[1])) / 2;
    }
  }

  var crnt = (doc.CrntEmps || {}).CrntEmp;
  if (crnt) {
    if (crnt.length && crnt.length > 0) {
      for (var i = 0; i < crnt.length; i++) {
        var crgs = crnt[i].CrntRgstns.CrntRgstn;
        if (crgs.length) {
          doc.score += 2 * (crgs.length - 1);
        } else {
          doc.score += 2;
        }
      }
    } else {
      var crgs = crnt.CrntRgstns.CrntRgstn;
      if (crgs.length) {
        doc.score += 2 * (crgs.length - 1);
      } else {
        doc.score += 2;
      }
    }
  }

  // Count drps
  if (doc.DRPs && doc.DRPs.DRP) {
    var drp = doc.DRPs.DRP;
    for (var key in drp) {
      if (drp.hasOwnProperty(key)) {
        var val = drp[key];
        if (val === 'Y') {
          doc.score -= 10;
        }
      }
    }
  }

  doc.score = Math.floor(doc.score * 10);

  print(doc.Info['@firstNm'] + ' ' + doc.Info['@lastNm'] + ' - ' + doc.score);
  db.iapds.save(doc);
});
