import React, {Component} from 'react'
import AsyncSelect from 'react-select/async';

const locationUrl = "/location/";

const promiseOptions = async (inputValue) => {
    if (inputValue.length > 2) {
        const response = await fetch(`${locationUrl}${inputValue}`);
        const responseJSON = await response.json();
        console.log(responseJSON);
        // Prepare response
        let cities = JSON.parse(responseJSON)
            .map(option => {
                let rObj = {}
                rObj.label = (`${option.name}` + (option.state ? `, ${option.state}` : ``) + (option.country ? `, ${option.country}` : ``));
                rObj.value = `${option.lat},${option.lon}`
                return rObj
            })
        console.log(cities);
        const p = new Promise((resolve) => {
            resolve(cities);
        });
        return p;
    }
};

export default class WithPromises extends Component {
    onCityChange = (option) => {
        if (typeof this.props.cityChange === "function") {
            this.props.cityChange(option);
        }
    };

    render() {
        return (<AsyncSelect
                cacheOptions
                defaultOptions
                onChange={this.onCityChange}
                loadOptions={promiseOptions}
                isSearchable={true}
                placeholder="Enter city"/>);
    }
}