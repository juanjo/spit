(function($){
  // Namespaces ------------------------------------------

  window.SP = {
    Models      : {},
    Collections : {},
    Views       : {},
    Templates   : {}
  };


  // Templates ------------------------------------------

  SP.Templates.spitter_tmpl = " \
  <iframe id='spit-<%= id %>' \
          src='<%= url %>' \
          class='spit' \
  </iframe>";

  // Models ------------------------------------------

  // [
  //   {
  //     "name": "bbc",
  //     "url": "http://bbc.com",
  //     "miliseconds": 5000
  //   },
  //   ...
  //   {
  //     "name": "cnn",
  //     "url": "http://cnn.com",
  //     "miliseconds": 16000
  //   }
  // ]

  SP.Models.Spit = Backbone.Model.extend({
    defaults :{
      miliseconds : 10000
    },

    validate: function(attrs) {
      var urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

      if (!urlRegex.test(attrs.url)) {
        return 'URL format not valid';
      }
    }
  });

  // Collections ------------------------------------------

  SP.Collections.Spits = Backbone.Collection.extend({
    model: SP.Models.Spit,

    sync : function (method, collection, options) {
      options.url       = '/spits.json';
      options.type      = 'GET';
      options.dataType  = 'json';
      options.data      =  {}; //this.setServerParams(this.params);

      return Backbone.sync(method, collection, options);
    },

  });

  // Views ------------------------------------------

  SP.Views.Spitter = Backbone.View.extend({
    el: 'body',
    template:  _.template(SP.Templates.spitter_tmpl),

    initialize: function() {
      _.bindAll(this);

      this.autoAdvance = null;
      this.reset();

      this.collection = new SP.Collections.Spits();
      this.collection.bind('reset', this.render);
      this.collection.fetch();
    },

    reset: function() {
      this.currentSpitIndex = 0;
    },

    currentSpit: function() {
      return this.spitAt(this.currentSpitIndex);
    },

    spitAt: function(index) {
      return this.collection.at(index);
    },

    incSpitIndex: function() {
      this.currentIndex = this.currentSpitIndex;

      if ( (this.currentIndex + 1) > (this.collection.length - 1)) {
        this.reset();
      } else {
        this.currentSpitIndex = this.currentIndex + 1;
      }
    },

    render: function(){
      var _self = this;

      $('body').html(this.template({
        id  : this.currentSpit().cid,
        url : this.currentSpit().get('url')
      }));

      $('#spit-' + this.currentSpit().cid).load(function (){
        _self.incSpitIndex();
        _self.autoAdvance = setTimeout(_self.render, _self.currentSpit().get('miliseconds'));
      });
    }
  });

  // Application ------------------------------------------

  spitView = new SP.Views.Spitter();

})(jQuery);