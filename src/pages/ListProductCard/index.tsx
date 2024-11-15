import QuotationExport from '@/components/TemplateExcel';
import QuotationExportPdf from '@/components/TemplatePdf';
import QuationExportPPT from '@/components/TemplatePpt';
import { getDistrict, getProvice } from '@/services/location';
import {
  addWhitelistFromProduct,
  listProducts,
  removeWhitelistFromProduct,
  sortProductWhiteList,
} from '@/services/products';
import { IProduct } from '@/types/product';
import { formatCurrency, formatNumberVietnamese, getSrcImg } from '@/utils';
import { GlobalOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { ProCard, ProList } from '@ant-design/pro-components';
import { Link, history, useLocation, useModel } from '@umijs/max';
import { Alert, Button, Card, Checkbox, Col, List, Row, Space, Typography, message } from 'antd';
import { useCallback, useRef, useState } from 'react';

const ListProductCard = () => {
  const location = useLocation();
  const formRef = useRef<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<any>([]);
  const { initialState, refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [multipleSelection, setMultipleSelection] = useState<any>([]);
  const [city, setCity] = useState<any>(null);
  const [district, setDistrict] = useState<any>(null);
  const [whitelist, setWhitelist] = useState<any>([]);

  const searchWhitelist = useCallback(async () => {
    if (currentUser?.whitelist.length === 0) {
      setWhitelist([]);
      message.error('Not found any product in whitelist');
      return;
    }
    const data = await sortProductWhiteList({ ids: currentUser?.whitelist });
    if (data?.data) {
      setWhitelist(data.data);
    } else {
      message.error('Not found any product in whitelist');
    }
  }, [currentUser]);

  const getListProductCard = useCallback(
    async (params: any) => {
      const { product_code, product_name, country, city, district, ward, type, areas } = params;
      console.log(params);
      const payload: any = {
        size: params.pageSize,
        page: location?.search?.split('=')[1] || params.current,
        product_code,
        product_name,
        country: country === 'vietnam' ? 'Việt nam' : country,
        city: city?.replace('Thành phố ', '').replace('Tỉnh ', ''),
        district,
        ward,
        status: 1,
      };

      if (type) {
        payload.type = type.join(',');
      }
      if (areas) {
        payload.areas = areas.join(',');
      }

      try {
        setLoading(true);
        console.log(payload);
        const { data, pagination, errorCode }: any = await listProducts(payload);
        console.log(data);
        setProducts({
          data: data || [],
          total: pagination?.total || 0,
          success: true,
        });
        return {
          data: data || [],
          total: pagination?.total || 0,
          success: true,
        };
      } catch (error) {
      } finally {
        setLoading(false);
        return {
          data: [],
          total: 0,
          success: false,
        };
      }
    },
    [location],
  );
  // useEffect(() => {
  //   getListProductCard();
  // }, []);

  const addWhiteList = async (product_id: string) => {
    try {
      const data = await addWhitelistFromProduct(product_id);
      console.log(data);
      if (data.errorCode === 0) {
        //getListProductCard();
        refresh();
        message.success('Add whitelist successfully');
      } else {
        message.error(data.message);
      }
    } catch (error: any) {
      const { data } = error?.response;
      message.error(data?.message);
    }
  };

  const removeWhiteList = async (product_id: string) => {
    try {
      const data = await removeWhitelistFromProduct(product_id);
      console.log(data);
      if (data.errorCode === 0) {
        //getListProductCard();
        refresh();
        message.success('Remove whitelist successfully');
      } else {
        message.error(data.message);
      }
    } catch (error: any) {
      const { data } = error?.response;
      message.error(data?.message);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: 20 }}>
        {multipleSelection.length > 0 && (
          <Alert
            message={
              <Row justify={'space-between'}>
                <div>
                  <Typography.Text strong>Selected: {multipleSelection.length}</Typography.Text>
                </div>
                <Space>
                  <QuotationExport
                    data={multipleSelection?.map((item: any, index: number) => {
                      return {
                        stt: index + 1,
                        typeOfAd: item?.type,
                        code: item.product_code,
                        nameOfMedia: item.product_name,
                        city: item.location.city?.split('-')[1],
                        location: item?.location?.address || '',
                        dimension: `${item.attributes.width}x${item.attributes.height}`,
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
                    showIcon
                  />

                  <QuotationExportPdf
                    data={multipleSelection?.map((item: IProduct) => {
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
                    showIcon
                  />
                  <QuationExportPPT
                    data={multipleSelection?.map((item: IProduct) => {
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
                          cost: `${formatNumberVietnamese(item?.cost).toString()}` + item.currency,
                          pixel: `${item.attributes.pixel_width}m x${
                            item.attributes.pixel_height
                          }m = ${formatNumberVietnamese(
                            item.attributes.pixel_width * item.attributes.pixel_height,
                          )} px`,
                          note: item.attributes.note,
                          bookingDuration: item.booking_duration,
                          images: item.images,
                          videoDuration: `${item.attributes.video_duration} s`,
                          productionCost: item?.production_cost
                            ? item?.production_cost.toString()
                            : '',
                          traffic: `${formatNumberVietnamese(item.traffic)} vehicles/day`,
                          areas: item.areas || [''],
                        },
                      };
                    })}
                    showIcon
                  />
                </Space>
              </Row>
            }
            type="success"
          />
        )}
      </div>
      <ProCard
        extra={
          whitelist.length > 0 ? (
            <Button
              type="primary"
              onClick={() => {
                setWhitelist([]);
                getListProductCard({});
              }}
              icon={<StarOutlined />}
            >
              Clear quick list
            </Button>
          ) : (
            <Button onClick={() => searchWhitelist()} icon={<StarOutlined />}>
              Find quick list
            </Button>
          )
        }
      >
        <ProList
          request={getListProductCard}
          rowKey="product_code" // Ensure each row has a unique key
          formRef={formRef}
          search={{
            searchGutter: 16,
            layout: 'vertical',
            defaultCollapsed: false,
            span: 3,
            searchText: 'Search',
          }}
          pagination={{
            pageSize: 6,
            total: products.total,
            size: 'small',
            current: parseInt(location?.search?.split('=')[1]) || 1,
            onChange: (page: number, pageSize: number) => {
              history.push(`/list-product-card?page=${page}`);
            },
          }}
          loading={loading}
          itemCardProps={{
            style: {
              height: '100%',
            },
          }}
          dataSource={whitelist.length > 0 ? whitelist : products.data}
          showActions="hover"
          itemLayout="vertical"
          grid={{ gutter: 16, column: 3 }}
          renderItem={(item: any, index) => (
            <List.Item>
              <Card
                hoverable
                style={{ width: '100%', backgroundColor: '#dba41f1f' }}
                cover={
                  <img
                    alt="example"
                    src={getSrcImg(item.images[0])}
                    style={{ width: '100%', height: 300 }}
                  />
                }
                bodyStyle={{ padding: '8px 4px', height: 200 }}
                bordered
                actions={[
                  <div>
                    <Space>
                      <QuotationExport
                        data={[
                          {
                            stt: index + 1,
                            typeOfAd: item?.type,
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
                            discount: '',
                            remark: '',
                            currency: item.currency,
                            mediaCost: formatNumberVietnamese(item?.cost),
                            netCostBeforeTax: '',
                          },
                        ]}
                        showIcon
                      />

                      <QuotationExportPdf
                        data={[
                          {
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
                              frequency: `${formatNumberVietnamese(
                                item.attributes.frequency,
                              )} spots`,
                              cost: `${formatNumberVietnamese(item?.cost).toString()} ${
                                item.currency
                              }`,

                              pixel: `${item.attributes.pixel_width} x ${item.attributes.pixel_height}`,
                              note: item.attributes.note,
                              bookingDuration: item.booking_duration,
                              images: item.images,
                              videoDuration: `${item.attributes.video_duration} s`,
                              productionCost: `${item?.production_cost}`,
                              traffic: `${formatNumberVietnamese(item.traffic)} vehicles/day`,
                              areas: item.areas || [''],
                            },
                          },
                        ]}
                        showIcon
                      />
                      <QuationExportPPT
                        data={[
                          {
                            base: {
                              code: item.product_code,
                              address: item?.location?.address || '',
                              description: item?.description,
                              name: item.product_name,
                            },
                            media: {
                              gps: item?.location?.gps,
                              type: item.type,
                              dimension: `${item.attributes.width}m x${
                                item.attributes.height
                              }m = ${formatNumberVietnamese(
                                item.attributes.width * item.attributes.height,
                              )} m2`,
                              adSides: item.attributes.add_side,
                              operationTime: `${item.attributes.opera_time_from} - ${item.attributes.opera_time_to}`,
                              frequency: `${formatNumberVietnamese(
                                item.attributes.frequency,
                              )} spots`,
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
                              areas: item.areas.join(',') || '',
                            },
                          },
                        ]}
                        showIcon
                      />
                    </Space>
                  </div>,
                  <div>
                    <Link to={`/maps/${item._id}`} target="_blank">
                      <Button type="primary" size="small" icon={<GlobalOutlined />} />
                    </Link>
                  </div>,
                  <div></div>,
                ]}
              >
                <Card.Meta
                  title={
                    <Row justify="space-between" align="top">
                      <Col span={20}>
                        <div onClick={() => history.push(`/list-product-card/${item?._id}`)}>
                          <div
                            style={{
                              color: '#febd21',
                              fontWeight: 'bold',
                              fontSize: 22,
                              whiteSpace: 'wrap',
                            }}
                          >
                            {item.product_name.toUpperCase()}
                          </div>
                        </div>
                      </Col>
                      <Col span={4}>
                        <Space>
                          {currentUser?.whitelist?.includes(item._id) ? (
                            <Button
                              size="middle"
                              icon={<StarFilled style={{ color: '#febd21' }} />}
                              type="link"
                              onClick={() => item?._id && removeWhiteList(item._id)}
                            />
                          ) : (
                            <Button
                              size="middle"
                              type="link"
                              icon={<StarFilled style={{ color: 'black' }} />}
                              onClick={() => item?._id && addWhiteList(item._id)}
                            />
                          )}
                          {multipleSelection.includes(item) ? (
                            // <Button
                            //   size="small"
                            //   icon={<PlusOutlined />}
                            //   type="primary"
                            //   onClick={() => {
                            //     setMultipleSelection((prev: any) =>
                            //       prev.filter((item: any) => item._id !== item._id),
                            //     );
                            //   }}
                            <Checkbox
                              checked
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setMultipleSelection((prev: any) => [...prev, item]);
                                } else {
                                  setMultipleSelection((prev: any) =>
                                    prev.filter((item: any) => item._id !== item._id),
                                  );
                                }
                              }}
                            />
                          ) : (
                            // <Button
                            //   size="small"
                            //   icon={<PlusOutlined />}
                            //   onClick={() => setMultipleSelection((prev: any) => [...prev, item])}
                            // />
                            <Checkbox
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setMultipleSelection((prev: any) => [...prev, item]);
                                } else {
                                  setMultipleSelection((prev: any) =>
                                    prev.filter((item: any) => item._id !== item._id),
                                  );
                                }
                              }}
                            />
                          )}
                        </Space>
                      </Col>
                    </Row>
                  }
                  description={
                    <div>
                      <Row>
                        <Col span={6}>
                          <Typography.Text>CODE:</Typography.Text>
                        </Col>
                        <Col span={18}>
                          <Typography.Text>{item.product_code}</Typography.Text>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={6}>
                          <Typography.Text>COST:</Typography.Text>
                        </Col>
                        <Col span={18}>
                          <Typography.Text>
                            {formatCurrency(item?.cost, item?.currency)} {item?.currency}
                          </Typography.Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={6}>
                          <Typography.Text>ADDRESS:</Typography.Text>
                        </Col>
                        <Col span={18}>
                          <Typography.Text> {item.location.address}</Typography.Text>
                        </Col>
                      </Row>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
          //@ts-ignore
          metas={{
            avatar: {
              search: false,
              dataIndex: 'images',
              render: (dom, entity) => {
                return (
                  <div style={{ width: '100%', height: '150px' }}>
                    <img
                      src={getSrcImg(entity.images[0])}
                      alt={entity.product_name}
                      style={{ width: '100%', objectFit: 'fill' }}
                    />
                  </div>
                );
              },
            },
            title: {
              title: 'Product Name',
              valueType: 'text',
              key: 'product_name',
            },
            description: {
              title: 'Product Code',
              valueType: 'text',
              key: 'product_code',
            },
            country: {
              title: 'Country',
              key: 'country',
              valueType: 'select',
              valueEnum: {
                vietnam: { text: 'Vietnam' },
                international: { text: 'International' },
              },
              fieldProps: {
                onChange: (value: any) => {
                  setCity(value);
                  formRef.current?.setFieldsValue({ city: undefined });
                  formRef.current?.setFieldsValue({ district: undefined });
                },
              },
            },
            city: {
              title: 'City',
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
              search: city !== null,
              key: 'city',
              fieldProps: {
                showSearch: true,
                onChange: (value: any) => {
                  setDistrict(value);
                  formRef.current?.setFieldsValue({ district: undefined });
                },
              },
            },
            district: {
              title: 'District',
              valueType: 'text',
              key: 'district',
              search: district !== null,
              request: async (params: any) => {
                return await getDistrict({
                  province_code: district.split('-')[0],
                  name: params?.keyWords || '',
                }).then((res) => {
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
              },
            },
            type: {
              title: 'Type',
              valueType: 'select',
              key: 'type',
              valueEnum: {
                LED: { text: 'LED' },
                BILLBOAD: { text: 'BILLBOARD' },
                PANO: { text: 'PANO' },
                BANNER: { text: 'BANNER' },
                BANDROLL: { text: 'BANDROLL' },
                POSM: { text: 'POSM' },
                TRIVISION: { text: 'TRIVISION' },
                LIGHT_BOX: { text: 'LIGHT BOX' },
                LCD_FRAME: { text: 'LCD/FRAME' },
                ROADSHOW: { text: 'ROADSHOW' },
                ACTIVATION: { text: 'ACTIVATION' },
                TRANSIT_AD: { text: 'TRANSIT AD' },
                AIRPORT: { text: 'AIRPORT' },
                METRO_SUBWAY: { text: 'METRO/SUBWAY' },
                TRAIN_STATION: { text: 'TRAIN STATION' },
                STREET_FURNITURE: { text: 'STREET FURNITURE' },
                CINEMA: { text: 'CINEMA' },
                OTHERS: { text: 'OTHERS' },
              },
              fieldProps: {
                mode: 'multiple',
                search: true,
                showCount: true,
                showSearch: true,
              },
            },
            areas: {
              title: 'Areas',
              valueType: 'select',
              fieldProps: {
                mode: 'multiple',
                search: true,
                showCount: true,
                showSearch: true,
              },
              key: 'areas',
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
            },
            content: {
              search: false,
              dataIndex: 'location',
              render: (dom, entity) => {
                return (
                  <div>
                    <Typography.Text strong>{entity.product_name}</Typography.Text>
                    <br />
                    <Typography.Text>{entity.product_code}</Typography.Text>
                    <br />
                    <Typography.Text>{entity.location.address}</Typography.Text>
                    <br />
                    <Typography.Text strong>
                      {entity.currency} {entity.cost}
                    </Typography.Text>
                  </div>
                );
              },
            },
          }}
        />
      </ProCard>
    </div>
  );
};

export default ListProductCard;
