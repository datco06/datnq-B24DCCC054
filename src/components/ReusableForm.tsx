import React from 'react';
import { Form, FormItemProps } from 'antd';

interface ReusableFormProps {
  form: any;
  layout?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

const ReusableForm: React.FC<ReusableFormProps> = ({ form, layout = 'vertical', children }) => {
  return (
    <Form form={form} layout={layout}>
      {children}
    </Form>
  );
};

export default ReusableForm;