/* global window,document, setInterval*/
import React, {Component} from 'react';
import {render} from 'react-dom';
// import MapGL from 'react-map-gl';
import {StaticMap} from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import {MapController} from 'deck.gl/dist/controllers';
// import EventManager from '../../src/controllers/events/event-manager';

import {json as requestJson} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data GeoJSON
const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/geojson/vancouver-blocks.json'; // eslint-disable-line

const colorScale = r => [r * 255, 140, 200 * (1 - r)];

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null
    };

    requestJson(DATA_URL, (error, response) => {
      if (!error) {
        this.setState({data: response});
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
    // TODO: this is to just simulate viwport prop change and test animation.
    this._interval = setInterval(() => this._toggleViewport(), 5000);
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  // TODO: this is to just simulate viwport prop change and test animation.
  _toggleViewport() {
    const newViewport = {};
    // console.log(`bearing: ${this.state.viewport.bearing}`)
    newViewport.pitch = (this.state.viewport.pitch === 0) ? 60.0 : 0.0;
    newViewport.bearing = (this.state.viewport.bearing === 0) ? 90.0 : 0.0;
    this.setState({
      viewport: {...this.state.viewport, ...newViewport}
    });
  }

  render() {
    const {viewport, data} = this.state;

    return (
      <MapController
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        animateViewport={true}>
        <StaticMap
          {...viewport}
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay
            viewport={viewport}
            data={data}
            colorScale={colorScale}
          />
        </StaticMap>
      </MapController>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
