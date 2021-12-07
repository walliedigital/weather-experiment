import React, {useState} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import {DateTime} from 'luxon';
import CityComponent from "./CityComponent";
import './App.scss';
// Weather images
import blank from './img/blank.jpg';
import img_01d from './img/01d.jpg';
import img_01n from './img/01n.jpg';
import img_02d from './img/02d.jpg';
import img_02n from './img/02n.jpg';
import img_03d from './img/03d.jpg';
import img_03n from './img/03n.jpg';
import img_04d from './img/04d.jpg';
import img_04n from './img/04n.jpg';
import img_09d from './img/09d.jpg';
import img_09n from './img/09n.jpg';
import img_10d from './img/10d.jpg';
import img_10n from './img/10n.jpg';
import img_11d from './img/11d.jpg';
import img_11n from './img/11n.jpg';
import img_13d from './img/13d.jpg';
import img_13n from './img/13n.jpg';
import img_50d from './img/50d.jpg';
import img_50n from './img/50n.jpg';

function App() {
    // Images and attribution, key matches icon field in OWM response
    const weatherImages = {
        "blank": {"img": blank, "href": "", "title": ""}, "01d": {
            "img": img_01d,
            "href": "https://unsplash.com/@eranjanak?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Eranjan"
        }, "01n": {
            "img": img_01n,
            "href": "https://unsplash.com/@reddalec?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Redd"
        }, "02d": {
            "img": img_02d,
            "href": "https://unsplash.com/@lizivonne?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Lizette Carrasco"
        }, "02n": {
            "img": img_02n,
            "href": "https://unsplash.com/@fineas_anton?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Fineas Anton"
        }, "03d": {
            "img": img_03d,
            "href": "https://unsplash.com/@ianebaldwin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText>",
            "title": "EXTERNAL: Photo by Ian Baldwin"
        }, "03n": {
            "img": img_03n,
            "href": "https://unsplash.com/@icefish?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Han-Hsing Tu"
        }, "04d": {
            "img": img_04d,
            "href": "https://unsplash.com/@nathananderson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Nathan Anderson"
        }, "04n": {
            "img": img_04n,
            "href": "https://unsplash.com/@anandu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Anandu Vinod"
        }, "09d": {
            "img": img_09d,
            "href": "https://unsplash.com/@tuvaloland?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Tuva Mathilde Løland"
        }, "09n": {
            "img": img_09n,
            "href": "https://unsplash.com/@bernard_?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Bernard"
        }, "10d": {
            "img": img_10d,
            "href": "https://unsplash.com/@thealbatrozz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText>",
            "title": "EXTERNAL: Photo by Albert Antony"
        }, "10n": {
            "img": img_10n,
            "href": "https://unsplash.com/@zhenhappy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by pan xiaozhen"
        }, "11d": {
            "img": img_11d,
            "href": "https://unsplash.com/@extaizi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Rafael Silva"
        }, "11n": {
            "img": img_11n,
            "href": "https://unsplash.com/@rehtrew?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Christian Werther"
        }, "13d": {
            "img": img_13d,
            "href": "https://unsplash.com/@maripopeo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Maria Vojtovicova"
        }, "13n": {
            "img": img_13n,
            "href": "https://unsplash.com/@stevenwright?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText>",
            "title": "EXTERNAL: Photo by Steven Wright"
        }, "50d": {
            "img": img_50d,
            "href": "https://unsplash.com/@cristofer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Cristofer Maximilian"
        }, "50n": {
            "img": img_50n,
            "href": "https://unsplash.com/@rosssneddon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
            "title": "EXTERNAL: Photo by Ross Sneddon"
        },
    }
    const [weatherImg, setWeatherImg] = useState(blank);
    const [weatherIcon, setWeatherIcon] = useState("blank")
    const [weatherTitle, setWeatherTitle] = useState("");
    const [weatherText, setWeatherText] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");
    const [tempKelvin, setTempKelvin] = useState(0);
    const [celsius, setCelsius] = useState(false); // Default to F
    const [imgAttribution, setImgAttribution] = useState({});

    const tempConvert = (kelvin) => {
        const cTemp = Math.round((kelvin - 275.15) * 10) / 10;
        const fTemp = Math.round(((kelvin - 275.15) * 9 / 5 + 32));
        return `${fTemp}ºF | ${cTemp}ºC`;
    }

    const weatherUrl = "/weather/lat/{lat}/lon/{lon}"; // lat=33.749&lon=-84.388
    const updateWeather = async (locationUpdate) => {
        // headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        console.log(locationUpdate);
        const locations = locationUpdate.value.split(",");
        const response = await fetch(weatherUrl
            .replace("{lat}", locations[0])
            .replace("{lon}", locations[1]));
        // console.log(response)
        const responseJSON = await response.json();
        // console.log(responseJSON);
        // TODO more error checking
        const responseOjb = JSON.parse(responseJSON);
        console.log(responseOjb);
        const weather = responseOjb.current.weather[0];
        setWeatherIcon(weather.icon);
        setWeatherText(weather.main);
        setTempKelvin(responseOjb.current.temp);
        setWeatherTitle(tempConvert(responseOjb.current.temp));
        setWeatherImg(weatherImages[weather.icon].img)
        setImgAttribution(weatherImages[weather.icon]);
        // Update the time
        const statusTime = DateTime.fromSeconds(responseOjb.current.dt, {zone: responseOjb.timezone});
        setLastUpdated(statusTime.toLocaleString(DateTime.DATETIME_MED));
    }
    return (<Container>
            <Row>
                <Col xs={1} sm={2} md={3}>
                </Col>
                <Col xs={10} sm={8} md={6} className="justify-content-md-center">
                    <h1 className="weather-title text-center">Weather Me This</h1>
                    <Card className="text-center shadow">
                        <Card.Header><CityComponent cityChange={updateWeather}/></Card.Header>
                        <Card.Img variant="top" src={weatherImg}/>
                        <Card.Body>
                            <div className="text-end info-up">
                                <a
                                    href={imgAttribution.href}
                                    className='text-decoration-none text-muted'
                                    title={imgAttribution.title}
                                    target="_blank"><i
                                    className='bi bi-info-circle'></i></a></div>
                            <Card.Title>{weatherTitle}</Card.Title>
                            <Card.Text>
                                {weatherText}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted">{lastUpdated}</Card.Footer>
                    </Card>
                </Col>
                <Col xs={1} sm={2} md={3}>
                </Col>
            </Row>
        </Container>);
}

export default App;
