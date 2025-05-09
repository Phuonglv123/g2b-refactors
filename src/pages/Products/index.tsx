import QuotationExport from '@/components/TemplateExcel';
import QuotationExportPdf from '@/components/TemplatePdf';
import QuationExportPPT from '@/components/TemplatePpt';
import { getDistrict, getProvice } from '@/services/location';
import { deleteSoftProduct, listProducts, toggleProductStatus } from '@/services/products';
import { getProviders } from '@/services/provider';
import { listUser } from '@/services/user';
import { formatCurrency, formatNumberVietnamese } from '@/utils';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Link, history, useLocation } from '@umijs/max';
import { Button, Space, Switch, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';

const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const Products: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [city, setCity] = useState<any>(null);
  const [district, setDistrict] = useState<any>(null);
  const query = useQuery();

  const [providerOptions, setProviderOptions] = useState<{ [key: string]: { text: string } }>({});
  const [userOption, setUserOption] = useState<{ [key: string]: { text: string } }>({});

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders({ pageSize: 1000 });
      const data = res.data || [];
      const options = data.reduce((acc: any, item: any) => {
        acc[item._id] = { text: item.name };
        return acc;
      }, {});
      setProviderOptions(options);
    };

    const fetchUser = async () => {
      const res = await listUser({ size: 1000 });
      const data = res.data || [];
      const options = data.reduce((acc: any, item: any) => {
        acc[item._id] = { text: item.username };
        return acc;
      }, {});
      setUserOption(options);
    };
    fetchUser();
    fetchProviders();
    onGetDistrict();
  }, [city]);

  const onGetDistrict = useCallback(async () => {
    if (!city) return;
    const data = await getDistrict({ province_code: city.split('-')[0] }).then((res) => {
      return res?.data.map((item: any) => {
        return {
          label: item.name,
          value: `${item.code}-${item.name}`,
        };
      });
    });
    setDistrict(data);
  }, [city]);

  const onRequest = async (params: any, filter: any, sort: any) => {
    console.log(params, filter, sort);
    const { product_code, product_name, country, city, district, ward } = params;
    const { status, type, areas, provider, createdBy } = sort;
    const payload: any = {
      size: params.pageSize || query.get('pageSize') || 10,
      page: params.current || query.get('current') || 1,
      product_code: product_code ? product_code : query.get('product_code'),
      product_name: product_name ? product_name : query.get('product_name'),
      country: country === 'vietnam' ? 'Việt nam' : country,
      city: city ? city : query.get('city'),
      district: district ? district : query.get('district'),
      ward: ward ? ward : query.get('ward'),
    };
    if (status || query.get('status')) {
      payload.status = status[0] || query.get('status');
    }
    if (type || query.get('type')) {
      payload.type = type.join(',') || query.get('type');
    }
    if (areas || query.get('areas')) {
      payload.areas = areas.join(',') || query.get('areas');
    }

    if (provider || query.get('provider')) {
      payload.provider = provider.join(',') || query.get('provider');
    }

    if (createdBy || query.get('createdBy')) {
      payload.user_id = createdBy.join(',') || query.get('createdBy');
    }

    history.push({
      pathname: '/products',
      search: `?${product_code ? `product_code=${product_code}&` : ''}${
        product_name ? `product_name=${product_name}&` : ''
      }${country ? `country=${country}&` : ''}${city ? `city=${city}&` : ''}${
        district ? `district=${district}&` : ''
      }${ward ? `ward=${ward}&` : ''}${status ? `status=${status}&` : ''}${
        type ? `type=${type}&` : ''
      }${areas ? `areas=${areas}&` : ''}${provider ? `provider=${provider}&` : ''}${
        createdBy ? `createdBy=${createdBy}&` : ''
      }`,
    });

    const data = await listProducts(payload);
    return {
      data: data.data,
      total: data.pagination.total,
    };
  };

  const toggleStatus = async (id: string) => {
    try {
      setLoading(true);
      await toggleProductStatus(id);
      message.success('Cập nhật trạng thái thành công');
      actionRef.current?.reload();
    } catch (error) {
      console.log(error);
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        loading={loading}
        rowKey={(record) => record._id}
        request={onRequest}
        toolBarRender={() => [
          <Button type="primary" onClick={() => history.push('/products/create')}>
            Create new product
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Space>
              <QuotationExport
                data={selectedRows.map((item, index) => {
                  return {
                    stt: index + 1,
                    typeOfAd: item.type,
                    code: item.product_code,
                    nameOfMedia: item.product_name,
                    city: item.location.city?.split('-')[1],
                    location: item?.location?.address || '',
                    dimension: `${item.attributes.width}x${
                      item.attributes.height
                    } = ${formatNumberVietnamese(
                      item.attributes.width * item.attributes.height,
                    )} m2`,
                    frequency: formatNumberVietnamese(item.attributes.frequency),
                    videoDuration: item.attributes.video_duration,
                    operationTime: `${item.attributes.opera_time_from} - ${item.attributes.opera_time_to}`,
                    adSides: item.attributes.add_side,
                    unitBuying: formatNumberVietnamese(item.cost),
                    bookingDuration: item.booking_duration,
                    note: item.attributes.note,
                    discount: '0',
                    remark: 'N/A',
                    currency: item.currency,
                    mediaCost: formatNumberVietnamese(item?.cost),
                    netCostBeforeTax: formatNumberVietnamese(item?.cost),
                  };
                })}
              />
              <QuotationExportPdf
                data={selectedRows.map((item) => {
                  return {
                    base: {
                      code: item.product_code,
                      address: item?.location?.address || '',
                      description: item?.description || '',
                      name: item.product_name,
                      gps: item?.location?.gps,
                    },
                    media: {
                      type: item.type,
                      dimension: `${item.attributes.width}m x ${
                        item.attributes.height
                      }m = ${formatNumberVietnamese(
                        item.attributes.width * item.attributes.height,
                      )} m2`,
                      adSides: item.attributes.add_side,
                      operationTime: `${item.attributes.opera_time_from} - ${item.attributes.opera_time_to}`,
                      frequency: `${formatNumberVietnamese(item.attributes.frequency)} spots`,
                      cost: `${formatNumberVietnamese(item?.cost).toString()} ${item.currency}`,
                      pixel: `${item.attributes.pixel_width} x ${item.attributes.pixel_height}`,
                      note: item.attributes.note,
                      bookingDuration: item.booking_duration,
                      images: item.images,
                      videoDuration: `${item.attributes.video_duration} s`,
                      productionCost: `${item?.production_cost}`,
                      traffic: `${formatNumberVietnamese(item.traffic)} vehicles/day`,
                      areas: item.areas || [''],
                    },
                  };
                })}
              />
              <QuationExportPPT
                data={selectedRows.map((item, index) => {
                  return {
                    base: {
                      code: item.product_code,
                      gps: item?.location?.gps,
                      address: item?.location?.address || '',
                      description: item.attributes.note,
                      name: item.product_name,
                    },
                    media: {
                      type: item.type,
                      dimension: `${item.attributes.width}m x${
                        item.attributes.height
                      }m = ${formatNumberVietnamese(
                        item.attributes.width * item.attributes.height,
                      )} m2`,
                      adSides: item.attributes.add_side,
                      operationTime: `${item.attributes.opera_time_from} - ${item.attributes.opera_time_to}`,
                      frequency: `${formatNumberVietnamese(item.attributes.frequency)} spots`,
                      cost: item.cost,
                      pixel: `${item.attributes.pixel_width}m x${
                        item.attributes.pixel_height
                      }m = ${formatNumberVietnamese(
                        item.attributes.pixel_width * item.attributes.pixel_height,
                      )} px`,
                      note: item.attributes.note,
                      bookingDuration: item.booking_duration,
                      images: item.images,
                      videoDuration: `${item.attributes.video_duration} s`,
                      productionCost: `${item?.production_cost}`,
                      traffic: `${formatNumberVietnamese(item.traffic)} vehicles/day`,
                      areas: item.areas || [''],
                    },
                  };
                })}
              />
            </Space>
          ),
        ]}
        search={{
          labelWidth: 'auto',
          layout: 'vertical',
        }}
        formRef={formRef}
        columns={[
          {
            title: 'Product Code',
            dataIndex: 'product_code',
            key: 'product_code',
            render: (_, record: any) => (
              <Link to={`/products/${record._id}`}>{record.product_code}</Link>
            ),
            initialValue: query.get('product_code'),
          },
          {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            initialValue: query.get('product_name'),
          },
          // {
          //   title: 'Country',
          //   dataIndex: 'country',
          //   key: 'country',
          //   render: (_, record: any) => record?.location?.country,
          //   valueType: 'select',
          //   valueEnum: {
          //     vietnam: { text: 'Vietnamese' },
          //     international: { text: 'International' },
          //   },
          //   fieldProps: {
          //     onChange: (value: any) => {
          //       setCity(value);
          //     },
          //   },
          // },
          {
            title: 'City',
            key: 'city',
            hideInTable: true,
            valueType: 'select',
            request: async (params: any) => {
              return await getProvice({ name: params?.keyWords || '' }).then((res) => {
                return res.data.map((item: any) => {
                  return {
                    label: item.name,
                    value: `${item.code}-${item.name}`,
                  };
                });
              });
            },
            fieldProps: {
              showSearch: true,
              onChange: (value: any) => {
                setCity(value);
                setDistrict(null);
                formRef.current?.setFieldsValue({ district: undefined });
              },
            },
          },
          {
            title: 'District',
            hideInTable: true,
            valueType: 'text',
            key: 'district',
            search: district !== null,
            // request: async () => {
            //   return await getDistrict({ province: district }).then((res) => {
            //     return res.data.map((item: any) => {
            //       return {
            //         label: item.label,
            //         value: item.label,
            //       };
            //     });
            //   });
            // },
            valueEnum: district?.reduce((acc: any, item: any) => {
              acc[item.value] = { text: item.label };
              return acc;
            }, {}),
            fieldProps: {
              showSearch: true,
            },
            initialValue: query.get('district'),
          },
          {
            title: 'Product Type',
            dataIndex: 'type',
            key: 'type',
            hideInSearch: true,
            filters: true,
            valueEnum: {
              LED: { text: 'LED' },
              BILLBOARD: { text: 'BILLBOARD' },
              PANO: { text: 'PANO' },
              BANNER: { text: 'BANNER' },
              BANDROLL: { text: 'BANDROLL' },
              POSM: { text: 'POSM' },
              TRIVISION: { text: 'TRIVISION' },
              'LIGHT BOX': { text: 'LIGHT BOX' },
              'LCD FRAME': { text: 'LCD/FRAME' },
              ROADSHOW: { text: 'ROADSHOW' },
              ACTIVATION: { text: 'ACTIVATION' },
              'TRANSIT AD': { text: 'TRANSIT AD' },
              AIRPORT: { text: 'AIRPORT' },
              'METRO SUBWAY': { text: 'METRO/SUBWAY' },
              'TRAIN STATION': { text: 'TRAIN STATION' },
              'STREET FURNITURE': { text: 'STREET FURNITURE' },
              CINEMA: { text: 'CINEMA' },
              'MARKET BILLBOARD': { text: 'MARKET BILLBOARD' },
              OTHERS: { text: 'OTHERS' },
            },
            initialValue: query.get('type'),
          },
          {
            title: 'Areas',
            dataIndex: 'areas',
            key: 'areas',
            hideInSearch: true,
            filters: true,
            valueEnum: {
              indoor: { text: 'Indoor' },
              outdoor: { text: 'Outdoor' },
              intersection: { text: 'Intersection' },
              roundabout: { text: 'Roundabout' },
              industrial_area: { text: 'Industrial Area' },
              shopping_mall: { text: 'Shopping Mall' },
              school: { text: 'School' },
              airport: { text: 'Airport' },
              highway: { text: 'Highway' },
              route: { text: 'Route' },
              city_center: { text: 'City Center' },
              hospital: { text: 'Hospital' },
              metro_subways: { text: 'Metro/Subways' },
              park: { text: 'Park' },
              supermarket: { text: 'Supermarket' },
              metro_train_bus_station: { text: 'Metro/Train/Bus Station' },
              office_building: { text: 'Office Building' },
              residents: { text: 'Residents' },
              others: { text: 'Others' },
            },
            render: (_, record: any) => {
              return record?.areas?.map((area: any) => (
                <Tag color="success">{area.charAt(0).toUpperCase() + area.slice(1)}</Tag>
              ));
            },
            initialValue: query.get('areas'),
          },
          {
            title: 'Media Cost',
            dataIndex: 'cost',
            key: 'cost',
            hideInSearch: true,
            render: (_, record: any) => {
              if (!record?.cost) return '';
              return formatCurrency(record?.cost, record?.currency);
            },
          },
          {
            title: 'Vendor',
            key: 'provider',
            hideInSearch: true,
            render: (_, record: any) => {
              return record?.provider?.name;
            },
            //filterMultiple: false,
            filters: true,
            valueType: 'checkbox',
            valueEnum: providerOptions,
            initialValue: query.get('provider'),
          },
          {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'name',
            valueType: 'dateRange',
            render: (_, record: any) => {
              return dayjs(record?.createdAt).format('DD/MM/YYYY');
            },
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            hideInSearch: true,
            filters: true,
            filterMultiple: false,
            valueEnum: {
              0: { text: 'InActive', status: 'Default' },
              1: { text: 'Active', status: 'Success' },
            },
            initialValue: query.get('status'),
            render: (_, record: any) => (
              <Switch
                checked={record.status === 1}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                onChange={() => toggleStatus(record._id)}
              />
            ),
          },
          {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            hideInSearch: true,
            filters: true,
            filterMultiple: true,
            valueEnum: userOption,
            render: (_, record: any) => {
              return record?.user_id?.username;
            },
          },
          {
            title: 'Action',
            key: 'name',
            hideInSearch: true,
            render: (_, record: any) => {
              return (
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => history.push(`/products/update/${record._id}`)}
                  />
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={async () => {
                      const data = await deleteSoftProduct(record._id);
                      if (data.errorCode === 0) {
                        message.success('Delete product successfully');
                        actionRef.current?.reload();
                      } else {
                        message.error('Delete product failed');
                      }
                    }}
                  />
                </Space>
              );
            },
          },
        ]}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
          selectedRowKeys: selectedRows.map((item) => item._id),
          preserveSelectedRowKeys: true,
        }}
      />
    </PageContainer>
  );
};

export default Products;
