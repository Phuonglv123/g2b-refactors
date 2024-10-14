import QuotationExport from '@/components/TemplateExcel';
import QuotationExportPdf from '@/components/TemplatePdf';
import QuationExportPPT from '@/components/TemplatePpt';
import {
  addWhitelistFromProduct,
  getProduct,
  removeWhitelistFromProduct,
} from '@/services/products';
import { IProduct } from '@/types/product';
import { convertTo12HourFormat, formatCurrency, formatNumberVietnamese, getSrcImg } from '@/utils';
import { StarOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { Button, Card, Row, Space, Tag, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';

// import plugins if you need

const DetailProductCard = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [loading, setLoading] = useState<boolean>(false);
  const { initialState, refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const getProductDetailById = useCallback(async () => {
    try {
      setLoading(true);
      if (!id) return;
      const data = await getProduct(id);
      if (data.errorCode === 0) {
        setProduct(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getProductDetailById();
  }, [id]);

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

  if (!product) return null;

  return (
    <PageContainer title="List Card Product">
      <ProCard split="vertical" loading={loading} gutter={16} bordered>
        <ProCard title="Images" colSpan={10} bodyStyle={{ padding: 0 }}>
          <ImageGallery
            showPlayButton={false}
            autoPlay={true}
            slideInterval={5000}
            items={product?.images.map((img) => {
              return {
                original: getSrcImg(img),
                thumbnail: getSrcImg(img),
              };
            })}
          />
          <br />
          <Card
            title={
              <div style={{ color: '#febd21', fontWeight: 'bold', fontSize: 14 }}>DESCRIPTION</div>
            }
            size="small"
            style={{ backgroundColor: '#dba41f1f' }}
          >
            <span>{product?.description}</span>
          </Card>
        </ProCard>
        <ProCard
          title={
            <div style={{ color: '#febd21', fontWeight: 'bold', fontSize: 25 }}>
              {product?.product_name.toUpperCase()}
            </div>
          }
          headerBordered
          extra={
            currentUser?.whitelist?.includes(product._id) ? (
              <Button
                size="small"
                icon={<StarOutlined />}
                type="primary"
                onClick={() => product?._id && removeWhiteList(product._id)}
              />
            ) : (
              <Button
                size="small"
                icon={<StarOutlined />}
                onClick={() => product?._id && addWhiteList(product._id)}
              />
            )
          }
        >
          <ProDescriptions
            dataSource={product}
            bordered
            layout="vertical"
            labelStyle={{ fontWeight: 'bold', color: '#dba41f' }}
            style={{ backgroundColor: '#dba41f1f' }}
          >
            <ProDescriptions.Item label="ADDRESS" span={2}>
              {product.location?.address}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="CITY" span={2}>
              {product.location?.city.split('-')[1]}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="DIMENSION (WxH)" span={2}>
              {product?.attributes?.width}m x {product?.attributes?.height}m ={' '}
              {formatNumberVietnamese(product?.attributes?.width * product?.attributes?.height)}m2
            </ProDescriptions.Item>
            <ProDescriptions.Item label="AREAS" span={2}>
              {product?.areas.map((area: any) => (
                <Tag color="success">{area.charAt(0).toUpperCase() + area.slice(1)}</Tag>
              ))}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="PIXEL (WxH)" span={1}>
              {product.attributes?.pixel_width} x {product.attributes?.pixel_height} Pixel
            </ProDescriptions.Item>
            <ProDescriptions.Item label="VIDEO DURATION" span={1}>
              {product.attributes?.video_duration} s
            </ProDescriptions.Item>
            <ProDescriptions.Item label="OPERATION TIME" span={1}>
              {convertTo12HourFormat(product?.attributes?.opera_time_from)} -{' '}
              {convertTo12HourFormat(product.attributes?.opera_time_to)}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="FREQUENCY" span={1}>
              {product.attributes?.frequency} spots
            </ProDescriptions.Item>
            <ProDescriptions.Item label="SHAPE" span={1}>
              {product.attributes?.shape}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="AD SIDE" span={1}>
              {product.attributes?.add_side}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="TYPE" span={1}>
              {product.type}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="TRAFFIC" span={1}>
              {formatNumberVietnamese(product?.traffic)} vehicles/day
            </ProDescriptions.Item>
            <ProDescriptions.Item label="BOOKING DURATION" span={1}>
              {product?.booking_duration}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="COST" span={1}>
              <Row justify={'space-between'}>
                <div>
                  {formatCurrency(product.cost, product?.currency)} {product.currency}
                </div>
              </Row>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="NOTE" span={1}>
              {product?.attributes?.note}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="PRODUCTION COST" span={1}>
              <Row justify={'space-between'}>
                <div>{product?.production_cost}</div>
                <Space>
                  <QuotationExport
                    data={[
                      {
                        stt: 1,
                        typeOfAd: product.type,
                        code: product.product_code,
                        nameOfMedia: product.product_name,
                        city: product.location.city?.split('-')[1],
                        location: product?.location?.address || '',
                        dimension: `${product.attributes.width}x${
                          product.attributes.height
                        } = ${formatNumberVietnamese(
                          product.attributes.width * product.attributes.height,
                        )} m2`,
                        frequency: formatNumberVietnamese(product.attributes.frequency),
                        videoDuration: product.attributes.video_duration,
                        operationTime: `${product.attributes.opera_time_from} - ${product.attributes.opera_time_to}`,
                        adSides: product.attributes.add_side,
                        unitBuying: formatNumberVietnamese(product.cost),
                        bookingDuration: product.booking_duration,
                        note: product.attributes.note,
                        discount: '0',
                        remark: 'N/A',
                        currency: product.currency,
                        mediaCost: formatNumberVietnamese(product.cost),
                        netCostBeforeTax: formatNumberVietnamese(product.cost),
                      },
                    ]}
                    showIcon
                  />

                  <QuotationExportPdf
                    data={[
                      {
                        base: {
                          code: product.product_code,
                          gps: '',
                          address: product?.location?.address || '',
                          description: product?.description,
                          name: product.product_name,
                        },
                        media: {
                          type: product.type,
                          dimension: `${product.attributes.width}m x${
                            product.attributes.height
                          }m = ${formatNumberVietnamese(
                            product.attributes.width * product.attributes.height,
                          )} m2`,
                          adSides: product.attributes.add_side,
                          operationTime: `${product.attributes.opera_time_from} - ${product.attributes.opera_time_to}`,
                          frequency: `${formatNumberVietnamese(
                            product.attributes.frequency,
                          )} spots`,
                          cost: product.cost,
                          pixel: `${product.attributes.pixel_width}m x${
                            product.attributes.pixel_height
                          }m = ${formatNumberVietnamese(
                            product.attributes.pixel_width * product.attributes.pixel_height,
                          )} px`,
                          note: product.attributes.note,
                          bookingDuration: product.booking_duration,
                          images: product.images,
                          videoDuration: `${product.attributes.video_duration} s`,
                          productionCost: `${product?.production_cost} ${product.currency}`,
                          traffic: `${formatNumberVietnamese(product.traffic)} vehicles/day`,
                          areas: product.areas || [''],
                        },
                      },
                    ]}
                    showIcon
                  />
                  <QuationExportPPT
                    data={[
                      {
                        base: {
                          code: product.product_code,
                          address: product?.location?.address || '',
                          description: product.description,
                          name: product.product_name,
                        },
                        media: {
                          gps: product?.location?.gps,
                          type: product.type,
                          dimension: `${product.attributes.width}m x ${
                            product.attributes.height
                          }m =  ${formatNumberVietnamese(
                            product.attributes.width * product.attributes.height,
                          )} m2`,
                          adSides: product.attributes.add_side,
                          operationTime: `${product.attributes.opera_time_from}s - ${product.attributes.opera_time_to}s`,
                          frequency: `${formatNumberVietnamese(
                            product.attributes.frequency,
                          )} spots`,
                          cost: `${product.cost} ${product.currency}`,
                          pixel: `${product.attributes.pixel_width}x${
                            product.attributes.pixel_height
                          } = ${formatNumberVietnamese(
                            product.attributes.pixel_width * product.attributes.pixel_height,
                          )} px`,
                          note: product.attributes.note,
                          bookingDuration: `${product.booking_duration}`,
                          images: product.images,
                          videoDuration: `${product.attributes.video_duration} s`,
                          productionCost: product?.production_cost || 0,
                          traffic: `${formatNumberVietnamese(product.traffic)} vehicles/day`,
                          areas: product.areas || [''],
                        },
                      },
                    ]}
                    showIcon
                  />
                </Space>
              </Row>
            </ProDescriptions.Item>
            {/* <ProDescriptions.Item label="DESCRIPTION" span={1}>
              {product?.description}
            </ProDescriptions.Item> */}
          </ProDescriptions>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default DetailProductCard;
