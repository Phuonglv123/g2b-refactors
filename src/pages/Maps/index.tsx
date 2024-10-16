import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';

import pin from '@/assets/pin.png';
import { listProducts } from '@/services/products';
import { formatNumberVietnamese, getSrcImg } from '@/utils';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>();

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoicGh1b25nbHY5NSIsImEiOiJjbTI2Nms1bHAweWx2MmlwejBrM2U5NWVmIn0.Nt5zhDaz45GDkWS82H5_zA';

    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [105.85642120300693, 21.02302701990176],
      zoom: 14,
    });

    mapRef.current.on('load', async () => {
      const { data }: any = await listProducts({ page: 1, size: 1000 });

      data?.forEach((product: any) => {
        const customMarker = document.createElement('img');
        customMarker.src = pin;
        customMarker.style.width = '60px';
        customMarker.style.height = '60px';
        customMarker.style.cursor = 'pointer'; // Change cursor to pointer

        // Create a popup with custom content and styling
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        }).setHTML(`
          <div style="background-color: white; color: black; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);">
            <h3 style="margin: 0;">${product.product_name}</h3>
            <p style="margin: 0;"><strong>Type:</strong> ${product?.type}</p>
            <p style="margin: 0;"><strong>Cost:</strong> ${formatNumberVietnamese(product?.cost)} ${
          product.currency
        }</p>
            <p style="margin: 0;"><strong>Address:</strong> ${product?.location?.address}</p>
            <div>
            <img src="${getSrcImg(
              product?.images[0],
            )}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;"/>
            </div>
          </div>
        `);

        // Create the marker
        new mapboxgl.Marker({ element: customMarker })
          .setLngLat([
            parseFloat(product.location?.longitude),
            parseFloat(product.location?.latitude),
          ])
          .addTo(mapRef.current);

        // Add hover events to the marker
        customMarker.addEventListener('mouseenter', () => {
          popup
            .setLngLat([
              parseFloat(product.location?.longitude),
              parseFloat(product.location?.latitude),
            ])
            .addTo(mapRef.current);
        });

        customMarker.addEventListener('mouseleave', () => {
          popup.remove();
        });
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return <div ref={mapContainerRef} style={{ height: '90vh' }} />;
};

export default Map;
