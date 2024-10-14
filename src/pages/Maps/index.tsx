import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';

const Map = () => {
  return (
    <div>
      <GoogleMap
        key={'AIzaSyAHU2U6wvsexrXkN6cd6t7Q174kH8LVOzE'}
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
      ></GoogleMap>
    </div>
  );
};

export default withScriptjs(withGoogleMap(Map));
