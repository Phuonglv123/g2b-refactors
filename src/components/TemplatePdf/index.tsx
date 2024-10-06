import { getSrcImg } from '@/utils';
import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import saveAs from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import React from 'react';

interface GeneralData {
  base: {
    code: string;
    gps: string;
    address: string;
    description: string;
    name: string;
  };
  media: {
    type: string;
    dimension: string;
    adSides: any;
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
  };
}

interface Props {
  data: GeneralData[];
  showIcon?: boolean;
}

const QuotationExportPdf: React.FC<Props> = ({ data, showIcon = false }) => {
  const [loading, setLoading] = React.useState(false);

  const generatePdf = async (watermark: boolean, showLogo: boolean) => {
    setLoading(true);
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const cleanString = (str: string) => str.replace(/[^\x00-\x7F]/g, '');

    const fontSize = 12;

    // Helper function to embed image
    const embedImage = async (pdfDoc: PDFDocument, imageUrl: string) => {
      const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

      // Try to embed image as JPG first, if it fails, try as PNG
      try {
        return await pdfDoc.embedJpg(imageBytes);
      } catch {
        return await pdfDoc.embedPng(imageBytes);
      }
    };

    // Loop through each item in data and create a page for it
    for (const [index, item] of data.entries()) {
      const page = pdfDoc.addPage([842, 595]);
      const { width, height } = page.getSize();

      // Add title
      page.drawImage(await embedImage(pdfDoc, getSrcImg('/uploads/bck2.png')), {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
      page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(0.357, 0.298, 0.302),
        opacity: 0.8,
      });
      showLogo &&
        page.drawImage(await embedImage(pdfDoc, getSrcImg('/uploads/logoWhite.png')), {
          x: 10,
          y: height - 40,
          width: 80,
          height: 31,
        });
      page.drawText(`${item?.base.name.toUpperCase()}`, {
        x: 120,
        y: height - 35,
        size: 24,
        font: boldFont,
        color: rgb(254 / 255, 189 / 255, 33 / 255),
      });

      // Add meta information
      const metaBaseInfo = [
        {
          label: 'Code',
          value: cleanString(item.base.code),
          icon: getSrcImg('/uploads/icon-01.png'),
        },

        {
          label: 'Address',
          value: cleanString(item.base.address),
          icon: getSrcImg('/uploads/icon-02.png'),
        },
        // { label: 'Description', value: item.base.description },
      ];
      const metaInfo = [
        {
          label: 'Type',
          value: cleanString(item.media.type),
          icon: getSrcImg('/uploads/icon-05.png'),
        },
        {
          label: 'Dimension (WxH)',
          value: cleanString(item.media.dimension),
          icon: getSrcImg('/uploads/icon-10.png'),
        },
        {
          label: 'Pixel (WxH)',
          value: item.media.pixel,
          icon: getSrcImg('/uploads/icon-14.png'),
        },

        {
          label: 'Ad Sides',
          value: item.media.adSides.toString(),
          icon: getSrcImg('/uploads/icon-06.png'),
        },

        {
          label: 'Traffic',
          value: item.media.traffic.toString(),
          icon: getSrcImg('/uploads/icon-11.png'),
        },
        {
          label: 'Operation Time',
          value: item.media.operationTime,
          icon: getSrcImg('/uploads/icon-16.png'),
        },
        {
          label: 'Video Duration',
          value: item.media.videoDuration.toString(),
          icon: getSrcImg('/uploads/icon-07.png'),
        },
        {
          label: 'Frequency',
          value: item.media.frequency,
          icon: getSrcImg('/uploads/icon-12.png'),
        },

        {
          label: 'Production Cost',
          value: item.media.productionCost.toString() || '',
          icon: getSrcImg('/uploads/icon-17.png'),
        },
        {
          label: 'Booking Duration',
          value: item.media.bookingDuration,
          icon: getSrcImg('/uploads/icon-08.png'),
        },
        {
          label: 'Media Cost',
          value: item.media.cost.toString(),
          icon: getSrcImg('/uploads/icon-13.png'),
        },

        {
          label: 'Areas',
          value: item.media.areas.join(', '),
          icon: getSrcImg('/uploads/icon-15.png'),
        },
        {
          label: 'GPS',
          value: item.base.gps,
          icon: getSrcImg('/uploads/icon-04.png'),
        },
        {
          label: 'Note',
          value: cleanString(item.media.note),
          icon: getSrcImg('/uploads/icon-09.png'),
        },
      ];

      // Draw base meta info
      const columnCountBase = 1;
      const columnWidthBase = (width - 80) / columnCountBase; // Width for each column
      const rowHeightBase = 55; // Space between rows
      let yPositionBase = height - 120; // Start Y position for the first row

      // Divide the metaBaseInfo items into 2 columns and draw them
      metaBaseInfo.forEach(async (info, index) => {
        const column = index % columnCountBase; // Determine the column (0, 1)
        const row = Math.floor(index / columnCountBase); // Determine the row number

        // Calculate the X and Y positions based on the column and row
        const xPosition = 20 + column * columnWidthBase;
        const currentYPosition = yPositionBase - row * rowHeightBase;
        const currentYPositionValue = yPositionBase - row * rowHeightBase - 20;
        // Draw the label and value in the respective column
        page.drawImage(await embedImage(pdfDoc, info.icon), {
          x: xPosition,
          y: currentYPosition,
          width: 25,
          height: 25,
        });

        page.drawText(`${info.label}:`, {
          x: xPosition + 40,
          y: currentYPosition + 15,
          size: fontSize,
          font: boldFont,
          color: rgb(254 / 255, 189 / 255, 33 / 255),
        });
        page.drawText(info.value, {
          x: xPosition + 40,
          y: currentYPositionValue + 15,
          size: fontSize,
          font: font,
          color: rgb(1, 1, 1),
          wordBreaks: [' '],
          maxWidth: columnWidthBase - 10,
        });
      });

      watermark &&
        page.drawImage(await embedImage(pdfDoc, getSrcImg('/uploads/watermark.png')), {
          x: 480,
          y: height - 200,
          width: 100,
          height: 80,
        });
      page.drawImage(await embedImage(pdfDoc, getSrcImg('/uploads/icon-03.png')), {
        x: 20,
        y: 370,
        width: 25,
        height: 25,
      });
      page.drawText(`Description:`, {
        x: 60,
        y: 390,
        size: fontSize,
        font: boldFont,
        color: rgb(254 / 255, 189 / 255, 33 / 255),
      });
      page.drawText(cleanString(item.base.description), {
        x: 60,
        y: 370,
        size: fontSize,
        font: font,
        color: rgb(1, 1, 1),
        wordBreaks: [' '],
        maxWidth: columnWidthBase - 280,
      });

      const columnCount = 3;
      const columnWidth = (width - 280) / columnCount; // Width for each column
      const rowHeight = 55; // Space between rows
      let yPosition = yPositionBase - 250; // Start Y position for the first row

      // Divide the metaInfo items into 3 columns and draw them
      metaInfo.forEach(async (info, index) => {
        const column = index % columnCount; // Determine the column (0, 1, or 2)
        const row = Math.floor(index / columnCount); // Determine the row number

        // Calculate the X and Y positions based on the column and row
        const xPosition = 20 + column * columnWidth;
        const currentYPosition = yPosition - row * rowHeight + 30;
        const currentYPositionValue = yPosition - row * rowHeight + 10;
        // Draw the label and value in the respective column
        page.drawImage(await embedImage(pdfDoc, info.icon), {
          x: xPosition,
          y: currentYPosition,
          width: 25,
          height: 25,
        });
        page.drawText(`${info.label}:`, {
          x: xPosition + 40,
          y: currentYPosition + 15,
          size: fontSize,
          font: boldFont,
          color: rgb(254 / 255, 189 / 255, 33 / 255),
        });
        page.drawText(info.value, {
          x: xPosition + 40,
          y: currentYPositionValue + 15,
          size: fontSize,
          font: font,
          color: rgb(1, 1, 1),
          maxWidth: columnWidth - 20,
          wordBreaks: [' '],
        });
      });

      // Flex-like layout for images at the bottom
      const maxImageWidth = 272; // Max width for each image
      const maxImageHeight = 10;
      let imageXPosition = width - maxImageWidth - 20; // Place the images on the right side
      let imageYPosition = height - 140;
      // Iterate over images and place them in the row
      for (const [imgIndex, imageUrl] of item.media.images.entries()) {
        try {
          const image = await embedImage(pdfDoc, getSrcImg(imageUrl));
          const scaledImage = image.scale(0.5); // Adjust size

          page.drawRectangle({
            x: imageXPosition + 20,
            y: imageYPosition - 80,
            width: maxImageWidth - 20,
            height: (scaledImage.height * maxImageWidth) / scaledImage.width, // Image height + border width
            borderWidth: 2, // Set the border thickness
            color: undefined, // Transparent fill
            borderColor: rgb(254 / 255, 189 / 255, 33 / 255), // Border color
          });

          page.drawImage(image, {
            x: imageXPosition + 20,
            y: imageYPosition - 80,
            width: maxImageWidth - 20,
            height: (scaledImage.height * maxImageWidth) / scaledImage.width,
          });
          imageYPosition -= maxImageHeight + 165; // Move Y position down
        } catch (error) {
          console.error(`Failed to embed image from ${imageUrl}:`, error);
        }
      }

      // // If more than one item, add a new page for the next one
      // if (index < data.length - 1) {
      //   pdfDoc.addPage();
      // }
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    //open(URL.createObjectURL(blob));

    saveAs(blob, `Quotation_${data[0].base.name}_${dayjs().unix()}.pdf`);
    setLoading(false);
  };

  return (
    <Tooltip title="Export to Pdf">
      <Popconfirm
        title={'Export with watermark and logo?'}
        okText="With watermark and logo"
        cancelText="Without watermark and logo"
        cancelButtonProps={{
          type: 'primary',
          title: 'Without watermark and logo',
          loading: loading,
          onClick: () => generatePdf(false, false),
        }}
        okButtonProps={{
          type: 'primary',
          title: 'With watermark and logo',
          loading: loading,
          onClick: () => generatePdf(true, true),
        }}
      >
        <Button
          loading={loading}
          type="primary"
          //onClick={generatePdf}
          icon={showIcon ? <FilePdfOutlined /> : null}
          size={showIcon ? 'small' : 'middle'}
          disabled={loading}
        >
          {!showIcon && 'Export to PDF'}
        </Button>
      </Popconfirm>
    </Tooltip>
  );
};

export default QuotationExportPdf;
