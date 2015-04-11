import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.resource('test', { path: '/hello' });
});

export default Router.map(function() {
  this.resource('iapds', { path: '/iapds' });
});

