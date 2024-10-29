import { createLocation, updateLocation } from '@/services/location';
import { createProduct, deleteImageProduct, getProduct, updateProduct } from '@/services/products';
import { ILocation } from '@/types/location';
import { IProduct } from '@/types/product';
import { getSrcImg } from '@/utils';
import { PageContainer, ProCard, ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Image, Row, Space, message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import InfoAttribute from './InfoAttribute';
import InfoLocation from './InfoLocation';
import InfoProduct from './InfoProduct';

type IRes = {
  data: IProduct;
  errorCode: number;
  message: string;
};
const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const CreateProduct: React.FC = () => {
  const [form] = ProForm.useForm();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const onCreateProduct = async (values: any) => {
    console.log(values);
    const payload: IProduct = {
      description: values.description,
      product_code: values.product_code || dayjs().unix(),
      product_name: values.product_name,
      type: values.type,
      areas: values.areas,
      status: values.status,
      images: values.images,
      cost: values.cost,
      provider: values.provider,
      booking_duration: values.booking_duration,
      currency: values.currency,
      production_cost: values.production_cost,
      traffic: values.traffic,
      attributes: {
        width: values.width,
        height: values.height,
        video_duration: values.video_duration,
        pixel_width: values.pixel_width,
        pixel_height: values.pixel_height,
        opera_time_from: values.opera_time_from,
        opera_time_to: values.opera_time_to,
        frequency: values.frequency,
        shape: values.shape,
        note: values.note,
        add_side: values.add_side,
      },
      location: values.location,
    };
    const payloadLocation: ILocation = {
      international: values.international ? true : false,
      country: values.international ? values?.country : 'Việt nam',
      city: values.city.replace('Thành phố', '').replace('Tỉnh', '').replace('- ', '-'),
      ward: values.ward,
      district: values.district,
      address: values.address,
      longitude: values.longitude,
      latitude: values.latitude,
      status: values.status,
      street: values.street,
      gps: values.gps,
    };
    if (values.international) {
      setLoading(true);
      try {
        const result = await createProduct(payload);
        if (result.errorCode === 0) {
          message.success('success!');
          form.resetFields();
        }
      } catch (error) {
        console.log(error);
        message.error('error!');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await createLocation(payloadLocation).then(async (res) => {
          console.log(1);
          payload.location = res.data._id;
          const result = await createProduct(payload);
          if (result.errorCode === 0) {
            message.success('success!');
            form.resetFields();
          }
        });
      } catch (error) {
        console.log(error);
        message.error('error!');
      } finally {
        setLoading(false);
      }
    }
  };

  const getDetailProduct = async () => {
    if (id) {
      const { data }: IRes = await getProduct(id);

      console.log(
        data?.images.map((item) => {
          return getSrcImg(item);
        }),
      );
      return {
        ...data,
        width: data.attributes.width,
        height: data.attributes.height,
        video_duration: data?.attributes?.video_duration,
        pixel_width: data?.attributes?.pixel_width,
        pixel_height: data?.attributes?.pixel_height,
        frequency: data?.attributes?.frequency,
        opera_time_from: data?.attributes?.opera_time_from,
        opera_time_to: data?.attributes?.opera_time_to,
        shape: data?.attributes?.shape,
        add_side: data?.attributes?.add_side,
        note: data?.attributes?.note,
        international: data?.location?.international,
        country: data?.location?.country,
        city: data?.location?.city,
        ward: data?.location?.ward,
        district: data?.location?.district,
        address: data?.location?.address,
        longitude: data?.location?.longitude,
        latitude: data?.location?.latitude,
        status: data?.location?.status,
        street: data?.location?.street,
        gps: data?.location?.gps,
        provider: data?.provider?._id,
        locationId: data?.location?._id,
        images: data?.images.map((item) => {
          return {
            uid: item,
            name: item,
            status: 'done',
            url: getSrcImg(item),
          };
        }),
      };
    }
    return {};
  };

  const onUpdateProduct = async (payload: IProduct & any) => {
    if (id) {
      const payloadLocation: ILocation = {
        international: payload.international ? true : false,
        country: payload.international ? payload?.country : 'Việt nam',
        city: payload.city,
        ward: payload.ward,
        district: payload.district,
        address: payload.address,
        longitude: payload.longitude,
        latitude: payload.latitude,
        status: payload.status,
        street: payload.street,
        gps: payload.gps,
      };

      const payloadProduct: IProduct = {
        product_code: payload.product_code,
        product_name: payload.product_name,
        type: payload.type,
        areas: payload.areas,
        status: payload.status,
        images: payload.images,
        cost: payload.cost,
        provider: payload.provider,
        booking_duration: payload.booking_duration,
        currency: payload.currency,
        production_cost: payload.production_cost,
        traffic: payload.traffic,
        description: payload?.description,
        attributes: {
          width: payload.width,
          height: payload.height,
          video_duration: payload.video_duration,
          pixel_width: payload.pixel_width,
          pixel_height: payload.pixel_height,
          opera_time_from: payload.opera_time_from,
          opera_time_to: payload.opera_time_to,
          frequency: payload.frequency,
          shape: payload.shape,
          note: payload.note,
          add_side: payload.add_side,
        },
        location: payload.locationId,
      };
      console.log(payloadProduct);
      try {
        const location = await updateLocation(payload.locationId, payloadLocation);
        if (location.errorCode === 0) {
          console.log(payloadProduct);
          const data = await updateProduct(id, payloadProduct);
          console.log(data);
          if (data.errorCode === 0) {
            message.success('success!');
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onFinish = async (values: any) => {
    if (id) {
      onUpdateProduct(values);
    } else {
      onCreateProduct(values);
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <PageContainer title={'Create Product'}>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      <ProCard>
        <ProForm<IProduct & any>
          form={form}
          onFinish={onFinish}
          request={getDetailProduct}
          submitter={{
            render: (_, dom) => (
              <Row justify="center">
                <Space>{dom}</Space>
              </Row>
            ),
          }}
          loading={loading}
          initialValues={{
            currency: 'USD',
          }}
        >
          <InfoProduct />

          <ProFormUploadButton
            accept="image/*"
            name="images"
            label="Images"
            title="Select images"
            max={5}
            fieldProps={{
              multiple: true,
              children: <div>Select images</div>,
              showUploadList: { showPreviewIcon: true, showRemoveIcon: true },
              onPreview: handlePreview,
              onRemove: async (file) => {
                console.log(file);
                if (id) {
                  await deleteImageProduct(id, file.uid)
                    .then((res) => {
                      if (res.errorCode === 0) {
                        message.success('Image deleted successfully');
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      message.error('error!');
                    });
                }
              },
            }}
            listType="picture-card"
          />

          <InfoAttribute />
          <InfoLocation form={form} />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default CreateProduct;
