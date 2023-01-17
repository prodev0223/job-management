import React from 'react'
import Select from 'react-select';

//@ts-ignore
const CustomSelect = ({ onChange, options, value, className }) => {

    //@ts-ignore
    const defaultValue = (options, value) => {
        //@ts-ignore
        return options ? options.find(option => option.value === value) : "";
    }


    return (
        <div className={className}>
            <Select
                value={defaultValue(options, value)}
                onChange={value => {
                    console.log('value in customseelct', value)
                    onChange(value)
                }}
                options={options}
            />

        </div>
    )
}

export default CustomSelect
