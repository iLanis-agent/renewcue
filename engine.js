/* RenewCue engine - pure document-expiry math with per-type lead times, shared by app.html and node tests. */
(function(root, factory){
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RenewCueEngine = factory();
})(typeof self !== 'undefined' ? self : this, function(){

  /* lead time in days before expiry when renewal should start */
  var LEAD_DAYS = {
    'passport': 270,          /* many countries want 6mo validity; renewal itself takes weeks */
    'visa': 90,
    "driver's license": 60,
    'id card': 60,
    'car registration': 45,
    'car insurance': 30,
    'health insurance': 60,
    'credit card': 30,
    'professional license': 90,
    'custom': 60
  };

  function toDate(iso){ var p = iso.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }

  function leadFor(type){
    return LEAD_DAYS.hasOwnProperty(type) ? LEAD_DAYS[type] : LEAD_DAYS.custom;
  }

  function daysTo(todayISO, expiryISO){
    return Math.round((toDate(expiryISO).getTime() - toDate(todayISO).getTime()) / 86400000);
  }

  /* status: expired / renew now (inside lead window) / ok */
  function status(todayISO, expiryISO, type){
    var d = daysTo(todayISO, expiryISO);
    if (d < 0) return 'expired';
    if (d <= leadFor(type)) return 'renew';
    return 'ok';
  }

  function renewByISO(expiryISO, type){
    var d = toDate(expiryISO);
    d.setUTCDate(d.getUTCDate() - leadFor(type));
    return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2);
  }

  function statusLabel(todayISO, expiryISO, type){
    var d = daysTo(todayISO, expiryISO);
    if (d < 0) return 'expired ' + (-d) + ' day' + (-d === 1 ? '' : 's') + ' ago';
    var lead = leadFor(type);
    if (d <= lead) return 'renew now - ' + d + ' day' + (d === 1 ? '' : 's') + ' left';
    var m = Math.round(d / 30.44);
    if (m < 24) return m + ' month' + (m === 1 ? '' : 's') + ' left';
    var y = Math.round(d / 365.25 * 10) / 10;
    return (y % 1 === 0 ? y.toFixed(0) : y) + ' years left';
  }

  /* urgency sort: expired and renew-now first (soonest deadline first), ok last */
  function sortDocs(docs, todayISO){
    return docs.slice().sort(function(a, b){
      var da = daysTo(todayISO, a.expiry), db = daysTo(todayISO, b.expiry);
      return da - db;
    });
  }

  function actionCount(docs, todayISO){
    var n = 0;
    for (var i = 0; i < docs.length; i++){
      var s = status(todayISO, docs[i].expiry, docs[i].type);
      if (s === 'expired' || s === 'renew') n++;
    }
    return n;
  }

  function fmtISO(iso){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var p = iso.split('-');
    return months[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0];
  }

  return {
    LEAD_DAYS: LEAD_DAYS,
    leadFor: leadFor,
    daysTo: daysTo,
    status: status,
    renewByISO: renewByISO,
    statusLabel: statusLabel,
    sortDocs: sortDocs,
    actionCount: actionCount,
    fmtISO: fmtISO
  };
});
