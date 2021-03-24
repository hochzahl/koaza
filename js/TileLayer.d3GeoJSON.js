L.TileLayer.d3GeoJSON =  L.TileLayer.extend({
    tileNodes:null,
    onAdd : function(map) {
        this._map = map;
        L.TileLayer.prototype.onAdd.call(this,map);
        this._path = d3.geo.path().projection(function(d) {
            var point = map.latLngToLayerPoint(new L.LatLng(d[1],d[0]));
            return [point.x,point.y];
        });
        this.on("tileunload",function(d) {
            if (d.tile.xhr) d.tile.xhr.abort();
            if (d.tile.nodes) d.tile.nodes.remove();
            d.tile.nodes = null;
            d.tile.xhr = null;
        });
    },
    onRemove: function (map) {
        d3.selectAll(".d3-geojson-layer").remove();
    },  
    _loadTile : function(tile,tilePoint) {
        var self = this;
        this._adjustTilePoint(tilePoint);

        if (!tile.nodes && !tile.xhr) {
            tile.xhr = d3.json(this.getTileUrl(tilePoint),function(error, geojson) {
                if (error) {
                    console.log(error);
                } else {
                    
                    if (self.options.filter){
                        var tmp;
                        tmp = geojson.features.filter(self.options.filter);
                        geojson.features = tmp;
                    }
                    
                    tile.xhr = null;
                    tile.nodes = d3.select(map._container).select("svg").append("g")
                        .attr("class", "d3-geojson-layer leaflet-zoom-hide");
                    tile.nodes.selectAll("path")
                    .data(geojson.features).enter()
                    .append("path")
                    .attr("d", self._path)
                    .attr(self.options.attr)
                    .style(self.options.style)
                    .on("click", self.options.onClick)
                    .on("mouseover", self.options.onMouseover )
                    .on("mouseout", self.options.onMouseoute )
                    ;
                }
            });
        }
    }
});