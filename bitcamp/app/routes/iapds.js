App.IapdsRoute = Ember.Route.extend({
  model: function() { return this.store.find('iapd'); }
});
