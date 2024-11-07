import { getSrcImg } from '@/utils';
import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import React from 'react';

interface QuotationData {
  stt: number;
  typeOfAd: string;
  code: string;
  nameOfMedia: string;
  city: string;
  location: string;
  dimension: string;
  frequency: string;
  videoDuration?: string;
  operationTime?: string;
  adSides: number;
  unitBuying: string;
  bookingDuration: string;
  currency: string;
  mediaCost?: any;
  note: string;
  discount: string;
  netCostBeforeTax?: any;
  remark: string;
}

interface MetaData {
  brand: string;
  agency: string;
  market: string;
  duration: string;
  sender: string;
  phoneNumber: string;
  email: string;
  sendingDate: string;
}

interface Props {
  data: QuotationData[];
  showIcon?: boolean;
}

const metaData = {
  brand: '',
  agency: '',
  market: '',
  duration: '',
  sender: '',
  phoneNumber: '0937 95 30 30',
  email: 'sale@g2b.com.vn',
  sendingDate: dayjs().format('DD/MM/YYYY'),
};

const QuotationExport: React.FC<Props> = ({ data, showIcon = false }) => {
  const logoSrc = getSrcImg('/uploads/logoText.png');
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet: any = workbook.addWorksheet('Quotation_G2B_' + new Date().getFullYear());

    // Fetch and load the image into the Excel sheet
    const logo = await fetch(logoSrc);
    const logoBlob = await logo.blob();
    const logoBuffer = await logoBlob.arrayBuffer();
    const imageId = workbook.addImage({
      buffer: logoBuffer,
      extension: 'png',
    });
    worksheet.addImage(imageId, 'A1:C4'); // Adjust the range for the logo size

    // Add meta information below the logo
    const metaInfo = [
      ['', '', '', '', '', '', 'QUOTATION'],
      ['Brand:', metaData.brand, '', '', '', '', `Quotation No: G2B_${dayjs().unix()}`],
      ['Agency:', metaData.agency, '', '', '', '', `Sender: ${metaData.sender}`],
      ['Market:', metaData.market, '', '', '', '', `Phone number: ${metaData.phoneNumber}`],
      ['Duration:', metaData.duration, '', '', '', '', `Email: ${metaData.email}`],
      ['', '', '', '', '', '', `Sending date: ${metaData.sendingDate}`],
    ];

    metaInfo.forEach((row) => {
      const excelRow = worksheet.addRow(row);
      excelRow.eachCell((cell: any) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', wrapText: true };

        cell.whiteSpace = { wrapText: true };
      });
    });

    // Merge header cells for meta information
    worksheet.mergeCells('D1:F1'); // QUOTATION title
    worksheet.mergeCells('A2:B2');
    worksheet.mergeCells('A3:B3');
    worksheet.mergeCells('A4:B4');
    worksheet.mergeCells('A5:B5');
    worksheet.mergeCells('A6:B6');

    worksheet.mergeCells('D2:F2'); // Quotation No
    worksheet.mergeCells('D3:F3');
    worksheet.mergeCells('D4:F4');
    worksheet.mergeCells('D5:F5');
    worksheet.mergeCells('D6:F6');

    // Add headers for the table
    const headers = [
      'STT',
      'Type of Ad',
      'Code',
      'Name of media',
      'City',
      'Location',
      'Dimension (mWxmH)',
      'Video duration / Frequency /Operation Time',
      'Ad sides',
      'Unit Buying',
      'Booking Duration',
      'Currency',
      'Media Cost',
      'Production Cost',
      'Total cost before TAX',
      'Remark',
      'Note',
    ];

    worksheet.addRow(headers);

    // Style the header row with a height of 30px and borders
    const headerRow = worksheet.getRow(12);
    headerRow.height = 60;
    headerRow.eachCell((cell: any) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', wrapText: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Yellow background
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      cell.whiteSpace = { wrapText: true };
    });

    // Add data rows
    data.forEach((item, index) => {
      const row = worksheet.addRow([
        index + 1,
        item.typeOfAd,
        item.code,
        item.nameOfMedia,
        item.city,
        item.location,
        item.dimension,
        `${item.videoDuration || ''}s / ${item.frequency} spots / ${item.operationTime || ''}`,
        item.adSides,
        item.unitBuying,
        item.bookingDuration,
        item.currency,
        item.mediaCost,
        item.discount,
        item.netCostBeforeTax,
        item.remark,
        item.note,
      ]);

      // Add borders to all data cells
      row.height = 30;
      row.eachCell((cell: any) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.font = { size: 12 };
        cell.whiteSpace = { wrapText: true };
      });
    });

    const totalCostRow = worksheet.addRow([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Total Cost:',
      '',
      '',
    ]);
    const taxAppliedRow = worksheet.addRow([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Tax Applied:',
      '',
      '',
    ]);
    const totalPaymentRow = worksheet.addRow([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Total Payment:',
      '',
      '',
    ]);
    worksheet.mergeCells(`A${totalCostRow.number}:N${totalCostRow.number}`);
    worksheet.mergeCells(`A${taxAppliedRow.number}:N${taxAppliedRow.number}`);
    worksheet.mergeCells(`A${totalPaymentRow.number}:N${totalPaymentRow.number}`);
    // Style summary rows
    [totalCostRow, taxAppliedRow, totalPaymentRow].forEach((row, index) => {
      row.eachCell((cell: any) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (index === 0)
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } }; // Light green background for the Total Cost row
        if (index === 1)
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } }; // Light orange background for the Tax Applied row
        if (index === 2)
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } }; // Light yellow background for the Total Payment row
      });
    });

    // Set column widths based on the text length (auto-fit)
    worksheet.columns.forEach((column: any) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell: any) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 2;
      column.whiteSpace = { wrapText: true };
    });

    const emptyRow = worksheet.addRow([]);
    worksheet.mergeCells(`A${emptyRow.number}:Q${emptyRow.number}`);

    // Add an empty row for spacing
    worksheet.addRow([]);

    // Add the notes section, merging all columns
    const notes = [
      ['NOTE:'],
      ['Advertising costs include VAT'],
      ['Quotation is valid for 15 days'],
      ['The available slot will be checked in the booking duration'],
      ['For permit application requirements, please consult with the sales staff'],
      ['Other additional costs will be quoted separately'],
    ];

    notes.forEach((note, idx) => {
      const row = worksheet.addRow(note);
      worksheet.mergeCells(`A${row.number}:Q${row.number}`); // Merge all columns for each note
      if (idx === 0) row.font = { bold: true }; // Make the "NOTE:" bold
    });
    worksheet.views = [{ showGridLines: false }];

    // Export the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `Quotation_${data[0]?.typeOfAd}_${new Date().getFullYear()}.xlsx`);
  };

  return (
    <Tooltip title="Export to Excel">
      <Button
        type="primary"
        onClick={exportToExcel}
        icon={showIcon ? <FileExcelOutlined /> : null}
        size={showIcon ? 'small' : 'middle'}
      >
        {!showIcon && ' Export to Excel'}
      </Button>
    </Tooltip>
  );
};

export default QuotationExport;
