/**
 * Created by Sebastian on 2016-12-16.
 */

Vue.config.debug = true;
Vue.config.devtools = true;

var bus = new Vue();

Vue.component('google-map', {
    template: '#map-template',
    props: ['address'],
    data: function(){
        return {
            map: null
        }
    },
    mounted: function() {
        bus.$on('MapsApiLoaded', this.createMap);
    },
    watch: {
      address: function(){
          this.addressChanged();
      }
    },
    methods: {
        createMap: function() {
            this.map = new google.maps.Map(this.$el, {
                //center: {lat: -34.397, lng: 150.644},
                zoom: 8
            });
            this.locateAddress();
        },
        locateAddress: function(){
            console.log(this.address);
            var geocoder = new google.maps.Geocoder();
            var vm = this;
            geocoder.geocode({ address: this.address }, function(results, status){
                if(status === google.maps.GeocoderStatus.OK){
                    vm.map.setCenter(results[0].geometry.location);
                    return new google.maps.Marker({
                        map: vm.map,
                        position: results[0].geometry.location
                    });
                }
                alert('Trouble bubble to locate that address. Sorry.');
            });
        },
        addressChanged: _.debounce(function(){
            this.locateAddress();
        }, 500)
    }

});

var app = new Vue({
    el: '#app',
    data: {
        address: null
    },
    methods: {
        init: function(){
            bus.$emit('MapsApiLoaded');
        }
    }
});

