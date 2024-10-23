import { getSrcImg } from '@/utils';
import { FilePptOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import PptxGenJS from 'pptxgenjs';
import { useState } from 'react';

interface GeneralData {
  base: {
    code: string;
    address: string;
    description: string;
    name: string;
  };
  media: {
    type: string;
    dimension: string;
    adSides: number;
    operationTime: string;
    frequency: string;
    cost: any;
    pixel: string;
    note: string;
    bookingDuration: string;
    images: string[];
    videoDuration: any;
    productionCost: any;
    traffic: any;
    areas: any;
    gps: string;
  };
}

type QuotationData = {
  data: any[];
  showIcon?: boolean;
};

const QuationExportPPT = ({ data, showIcon }: QuotationData) => {
  const [loading, setLoading] = useState(false);
  const handleExport = async (showLogo: boolean, showWater: boolean) => {
    setLoading(true);
    const pptx: any = new PptxGenJS();
    for (const [index, item] of data.entries()) {
      console.log(item, index);
      const slide = pptx.addSlide();
      slide.background = {
        path: getSrcImg('/uploads/bck.png'),
        fill: 'ffffff',
      };

      showLogo &&
        slide.addImage({
          path: getSrcImg('/uploads/logoWhite.png'), // Convert the image to base64
          x: 0.1,
          y: 0.1,
          w: 0.8,
          h: 0.3, // Fixed height
        });

      showWater &&
        slide.addImage({
          path: getSrcImg('/uploads/watermark.png'), // Convert the image to base64
          x: 5,
          y: 1.5,
          w: 0.8,
          h: 0.5, // Fixed height
        });

      // Add title
      slide.addText(item.base.name, {
        x: 1,
        y: 0.06,
        fontSize: 18,
        color: 'febd21',
        w: 6,
        h: 0.5,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-01.png'), // Convert the image to base64
        x: 0.23,
        y: 0.8,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Product Code:', {
        x: 0.4,
        y: 0.8,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.19,
        h: 0.22,
      });

      slide.addText(item.base.code, {
        x: 0.4,
        y: 1,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-02.png'), // Convert the image to base64
        x: 0.23,
        y: 1.3,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Address:', {
        x: 0.4,
        y: 1.3,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.19,
        h: 0.22,
      });

      slide.addText(item.base.address, {
        x: 0.4,
        y: 1.5,
        fontSize: 10,
        color: 'ffffff',
        w: 6,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-03.png'), // Convert the image to base64
        x: 0.23,
        y: 1.8,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Description:', {
        x: 0.4,
        y: 1.8,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.19,
        h: 0.22,
      });

      slide.addText(item.base.description, {
        x: 0.4,
        y: 1.9,
        fontSize: 10,
        color: 'ffffff',
        w: 6,
        h: 0.6,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-05.png'),
        x: 0.23,
        y: 2.42,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Type:', {
        x: 0.4,
        y: 2.42,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.19,
        h: 0.22,
      });

      slide.addText(item.media.type, {
        x: 0.4,
        y: 2.62,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-10.png'),
        x: 1.92,
        y: 2.45,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Dimension (WxH):', {
        x: 2.09,
        y: 2.45,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.dimension, {
        x: 2.09,
        y: 2.65,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-14.png'),
        x: 3.59,
        y: 2.45,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Pixel (WxH):', {
        x: 3.76,
        y: 2.45,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.pixel, {
        x: 3.76,
        y: 2.65,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-06.png'),
        x: 0.23,
        y: 3.1,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Ad Sides:', {
        x: 0.4,
        y: 3.1,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.adSides, {
        x: 0.4,
        y: 3.3,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-11.png'),
        x: 1.92,
        y: 3.13,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Traffic:', {
        x: 2.09,
        y: 3.13,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.traffic, {
        x: 2.09,
        y: 3.33,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-16.png'),
        x: 3.59,
        y: 3.77,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Operation Time:', {
        x: 3.76,
        y: 3.13,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.operationTime, {
        x: 3.76,
        y: 3.33,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      //-------

      slide.addImage({
        path: getSrcImg('/uploads/icon-07.png'),
        x: 0.23,
        y: 3.7,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Video Duration:', {
        x: 0.4,
        y: 3.7,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.videoDuration, {
        x: 0.48,
        y: 3.9,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-12.png'),
        x: 1.92,
        y: 3.73,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Frequency:', {
        x: 2.09,
        y: 3.73,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.frequency, {
        x: 2.18,
        y: 3.93,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-17.png'),
        x: 3.59,
        y: 3.73,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Production Cost:', {
        x: 3.76,
        y: 3.73,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.productionCost, {
        x: 3.84,
        y: 3.93,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-08.png'),
        x: 0.23,
        y: 4.3,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Booking Duration:', {
        x: 0.4,
        y: 4.3,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.bookingDuration, {
        x: 0.48,
        y: 4.5,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-13.png'),
        x: 1.92,
        y: 4.32,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Media Cost:', {
        x: 2.09,
        y: 4.32,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.cost, {
        x: 2.18,
        y: 4.52,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-15.png'),
        x: 3.59,
        y: 4.32,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Areas:', {
        x: 3.76,
        y: 4.32,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.areas, {
        x: 3.84,
        y: 4.58,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-04.png'),
        x: 1.92,
        y: 4.98,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('GPS:', {
        x: 2.09,
        y: 4.98,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.gps, {
        x: 2.18,
        y: 5.2,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      slide.addImage({
        path: getSrcImg('/uploads/icon-09.png'),
        x: 0.23,
        y: 4.98,
        w: 0.23,
        h: 0.2,
      });

      slide.addText('Note:', {
        x: 0.4,
        y: 4.98,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'febd21',
        w: 1.79,
        h: 0.22,
      });

      slide.addText(item.media.note, {
        x: 0.48,
        y: 5.2,
        fontSize: 10,
        color: 'ffffff',
        w: 2,
        h: 0.2,
      });

      // Images aligned vertically on the left
      const imgXPos = 6.5; // Keep images aligned to the left
      let imgYPos = 0.3; // Initial Y position for the first image
      const maxImageWidth = 3; // Maximum width of the image
      const imageHeight = 1.5; // Fixed height for the image
      const imageSpacing = 0.2; // Vertical spacing between images

      for (const imageUrl of item.media.images) {
        try {
          slide.addShape(pptx.shapes.RECTANGLE, {
            x: imgXPos,
            y: imgYPos,
            w: maxImageWidth + 0.04,
            h: imageHeight + 0.04,
            fill: { type: 'solid', color: 'febd21' },
          });
          slide.addImage({
            path: getSrcImg(imageUrl), // Convert the image to base64
            x: imgXPos + 0.02,
            y: imgYPos + 0.02,
            w: maxImageWidth,
            h: imageHeight, // Fixed height
          });

          // Increment the y position for the next image, adding spacing
          imgYPos += imageHeight + imageSpacing;
        } catch (error) {
          console.error(`Error embedding image from ${imageUrl}:`, error);
        }
      }
    }
    pptx.writeFile({ fileName: `Quotation_${data[0].base.name}_${dayjs().unix()}.pptx` });
    setLoading(false);
  };

  return (
    <Tooltip title="Export to Ppt">
      <Popconfirm
        title={'Export with watermark and logo?'}
        okText="With watermark and logo"
        cancelText="Without watermark and logo"
        cancelButtonProps={{
          type: 'primary',
          title: 'Without watermark and logo',
          loading: loading,
          onClick: () => handleExport(false, false),
        }}
        okButtonProps={{
          type: 'primary',
          title: 'With watermark and logo',
          loading: loading,
          onClick: () => handleExport(true, true),
        }}
      >
        <Button
          type="primary"
          //onClick={handleExport}
          icon={showIcon ? <FilePptOutlined /> : null}
          size={showIcon ? 'small' : 'middle'}
        >
          {!showIcon && 'Export to PPT'}
        </Button>
      </Popconfirm>
    </Tooltip>
  );
};

export default QuationExportPPT;
