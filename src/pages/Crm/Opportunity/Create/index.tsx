import { createOpportunity, getOpportunity } from '@/services/opportunity';
import { IOpportunityPayload } from '@/types/opportunity';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';

const CreateOpportunity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const onFinish = async (values: IOpportunityPayload) => {
    try {
      const { errorCode, data } = await createOpportunity(values);
      if (errorCode === 0) {
        history.push(`/crm/opportunity/${data._id}/edit`);
      }
    } catch (error) {}
  };

  const onRequest = async () => {
    try {
      if (!id) {
        return {};
      }
      const { errorCode, data } = await getOpportunity(id);
      if (errorCode === 0) {
        return data;
      }
    } catch (error) {
      return null;
    }
  };
  return (
    <PageContainer onBack={() => history.push('/crm/opportunity')} title="Create Opportunity">
      <ProCard>
        <ProForm<IOpportunityPayload> layout="vertical" onFinish={onFinish} request={onRequest}>
          <ProFormGroup
            title="Responsibility"
            colProps={{ span: 24 }}
            rowProps={{ gutter: 24, slot: '4' }}
          >
            <ProFormText
              width={'xl'}
              name={['respone', 'title']}
              label="Title"
              placeholder="Enter the title"
            />
            <ProFormText
              width={'xl'}
              name={['respone', 'name']}
              label="Name"
              placeholder="Enter the name"
            />
            <ProFormText
              width={'xl'}
              name={['respone', 'department']}
              label="Department"
              placeholder="Enter the department"
            />
            <ProFormText
              width={'xl'}
              name={['respone', 'phone']}
              label="Phone"
              placeholder="Enter the phone"
            />
            <ProFormText
              width={'xl'}
              name={['respone', 'email']}
              label="Email"
              placeholder="Enter the email"
            />
            <ProFormText
              width={'xl'}
              name={['respone', 'address']}
              label="Address"
              placeholder="Enter the address"
            />
          </ProFormGroup>
          <ProFormGroup title="Company">
            <ProFormText
              width={'xl'}
              name={['company', 'bankAccount']}
              label="Bank Account"
              placeholder="Enter the bank account"
            />
            <ProFormText
              width={'xl'}
              name={['company', 'bankName']}
              label="Bank Name"
              placeholder="Enter the bank name"
            />
            <ProFormText
              width={'xl'}
              name={['company', 'type']}
              label="Type"
              placeholder="Enter the type"
            />
            <ProFormText
              width={'xl'}
              name={['company', 'field']}
              label="Field"
              placeholder="Enter the field"
            />
            <ProFormText
              width={'xl'}
              name={['company', 'scale']}
              label="Scale"
              placeholder="Enter the scale"
            />
            <ProFormText
              width={'xl'}
              name={['company', 'major']}
              label="Major"
              placeholder="Enter the major"
            />
            <ProFormText
              width={'xl'}
              name={['company', 'taxCode']}
              label="Tax Code"
              placeholder="Enter the tax code"
            />
          </ProFormGroup>

          <ProFormGroup title="Address">
            <ProFormText width={'xl'} name={['address', 'city']} label="City" />
            <ProFormText width={'xl'} name={['address', 'district']} label="District" />
            <ProFormText width={'xl'} name={["address", "ward"]} label="Ward" />
            <ProFormText width={'xl'} name={["address", "street"]} label="Street" />
            <ProFormText width={'xl'} name={["address", "address"]} label="Address" />
          </ProFormGroup>

          <ProFormText name="description" label="Description" placeholder="Enter the description" />
          <ProFormSelect
            name="status"
            label="Status"
            placeholder="Enter the status"
            options={[
              {
                label: 'Published',
                value: 'published',
              },
              {
                label: 'Draft',
                value: 'draft',
              },
              {
                label: 'Archived',
                value: 'archived',
              },
            ]}
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default CreateOpportunity;
