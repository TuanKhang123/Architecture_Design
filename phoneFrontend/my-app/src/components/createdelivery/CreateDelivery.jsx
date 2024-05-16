import React from 'react'
import { useState, useEffect } from 'react';
import "../createdelivery/CreateDelivery.css"
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, updateDetailAddress } from '../feature/user/userSlice';
import { toast } from 'react-toastify';
import axios from 'axios'


const CreateDelivery = () => {

    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setselectedProvince] = useState();
    const [selectedDistrict, setselectedDistrict] = useState();
    const [selectedWard, setSelectedWard] = useState()


    const { user } = useSelector(state => state.user)
    const accessToken = localStorage.getItem('accessToken');

    const dispatch = useDispatch()

    const onFinish = (values) => {
        const data = {
            values,
            accessToken
        }
        dispatch(updateDetailAddress({
            province: values?.province,
            district: values?.district,
            ward: values?.ward,
            detail_address: values?.detail_address,
            accessToken: accessToken
        })).then((res) => {
            if (res?.payload?.result) {
                toast.success('Update successfully', {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '#32a852', backgroundColor: '#D7F1FD' },
                });
            }
            else {
                toast.error('Update fail', {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { color: '#bf0d0d', backgroundColor: '#D7F1FD' },
                });
            }
        })

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleProvince = (value, option) => {
        setselectedProvince(option?.key);
        form.setFieldsValue({ 'district': undefined });
        form.setFieldsValue({ 'ward': undefined });
    }

    const handleDistrict = (value, option) => {
        setselectedDistrict(option?.key)
        form.setFieldsValue({ 'ward': undefined });
    }

    const handleWard = (value, option) => {
        setSelectedWard(option?.key)
    }

    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
    };

    useEffect(() => {
        dispatch(getUser(accessToken))
        if (user) {
            form.setFieldsValue({
                'province': user[0]?.province,
                'district': user[0]?.district,
                'ward': user[0]?.wards,
                'detail_address': user[0]?.address,
            })
        }
    }, [accessToken])

    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/p/")
            .then((response) => {
                setProvince(response?.data)
            })
            .catch(error => {
                console.log(error);
            })
        dispatch(getUser(accessToken))

        
    }, [])

    useEffect(() => {
        if (selectedProvince) {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((response) => {
                    setDistrict(response.data.districts)
                })
                .catch(error => {
                    console.log(error);
                })
            setSelectedWard(0)
        }
    }, [selectedProvince])

    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then((response) => {
                    setWards(response.data.wards)
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [selectedDistrict])

    const { Option } = Select;
    return (
        <>
            <div className='createdelivery'>
                <p className='createdelivery__name'>CREATE DELIVERY ADDRESS</p>
                <Form
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    className='createdelivery_form'
                >
                    <Form.Item
                        label="ADDRESS"
                        required
                        className='createdelivery_address'
                        style={{ marginBottom: '0px' }}
                    >
                        <Form.Item
                            name="province"
                            required
                            rules={[
                                {
                                    required: true, validator: (rule, value) => {
                                        if (value === undefined)
                                            return Promise.reject('Please select province');
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Select
                                placeholder="Province"
                                onChange={(value, option) => handleProvince(value, option)}
                                allowClear
                                className='createdelivery_province'
                            >
                                {province
                                    ? province.map((itemprovince) => {
                                        return (
                                            <Option
                                                key={itemprovince?.code}
                                                value={itemprovince?.name}
                                            >
                                                {itemprovince?.name}
                                            </Option>
                                        )
                                    })
                                    : null}
                            </Select>
                        </Form.Item>
                        {console.log(district)}
                        <Form.Item
                            name="district"
                            rules={[
                                {
                                    required: true, validator: (rule, value) => {
                                        if (value === undefined)
                                            return Promise.reject('Please select district.');
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Select
                                placeholder="District"
                                onChange={(value, option) => handleDistrict(value, option)}
                                allowClear
                                className='createdelivery_district'
                            >
                                {
                                    district
                                        ? district.map((itemdistrict) => (
                                            <Option
                                                key={itemdistrict?.code}
                                                value={itemdistrict?.name}
                                            >
                                                {itemdistrict?.name}
                                            </Option>
                                        ))
                                        : null
                                }
                            </Select>

                        </Form.Item>

                        <Form.Item
                            name="ward"
                            rules={[
                                {
                                    required: true, validator: (rule, value) => {
                                        if (value === undefined)
                                            return Promise.reject('Please select ward.');
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Select
                                placeholder="Wards"
                                onChange={(value, option) => handleWard(value, option)}
                                allowClear
                                className='createdelivery_ward'
                            >
                                {
                                    wards
                                        ? wards.map((ward) => (
                                            <Option
                                                key={ward?.code}
                                                value={ward?.name}
                                            >
                                                {ward?.name}
                                            </Option>
                                        ))
                                        : null
                                }
                            </Select>

                        </Form.Item>

                    </Form.Item>


                    <Form.Item
                        name="detail_address"
                        label="DETAIL ADDRESS"
                        rules={[
                            {
                                required: true, message: 'Please enter detail address'
                            }
                        ]}
                        className='createdelivery_note'
                    >

                        <Input
                            style={{ height: '45px', backgroundColor: '#f3f4f6' }}
                        />
                    </Form.Item>

                    <Form.Item
                        className='createdelivery-btn'
                    >
                        <Button type="primary" htmlType="submit">
                            UPDATE INFORMATION
                        </Button>
                    </Form.Item>
                </Form>
            </div >
        </>
    )
}
export default CreateDelivery