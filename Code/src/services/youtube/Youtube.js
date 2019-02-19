import Axios from 'axios';
import {appConfig} from '../../config';
import {VideoClass} from '../../models/video.class';
import {Category} from '../../models/category.class';
import {Country} from '../../models/country.class';
import Settings from '../settings/Settings';
const axios = Axios.create({
    baseURL: appConfig.getYoutubeEndPoint('')
});
const settings=new Settings();
export class YoutubeService {
    nextPageToken = '';

    getTrendingVideos=async(count = settings.get().maxResults)=> {
        const {regionCode,videoCategoryId}=settings.get();
        const loadVideos= async (params)=>{
            return axios.get('/videos', {params}).then(({ data }) => {
                const { items, nextPageToken } = data;
                this.nextPageToken = nextPageToken;

                return items
                    .map((item) => new VideoClass(item));
            }).catch((err) => err);
        };
        this.nextPageToken='';
        let videos = [];
        let params = {
            part: appConfig.partsToLoad,
            chart: appConfig.chart,
            videoCategoryId,
            regionCode:regionCode,
            maxResults: count<50?count:50,
            key: appConfig.youtubeApiKey,
            pageToken: this.nextPageToken
        };

        while (videos.length < count) {
            params.maxResults =  count - videos.length<50?count-videos.length:50;
            params.pageToken = this.nextPageToken;
            videos = videos.concat(await loadVideos(params));
        }
        return videos;
    };
    getCategories(){
        const {regionCode}=settings.get();
        const params = {
            part: 'snippet',
            regionCode:regionCode,
            key: appConfig.youtubeApiKey,
        };
            return axios.get('/videoCategories', {params}).then(({ data }) => {
                const { items} = data;
                // console.log(items)
                return items
                    .map((item) => new Category(item));
            }).catch((err) => err);

    }

    getCountries(){
        const params = {
            part: 'snippet',
            hl:'en-US',
            key: appConfig.youtubeApiKey,
        };
        return axios.get('/i18nRegions', {params}).then(({ data }) => {
            const { items} = data;
            return items
                .map((item) => new Country(item));
        }).catch((err) => err);

    }

    isValid(id){
        const params = {
            id,
            part:'snippet',
            key: appConfig.youtubeApiKey,
        };
        return axios.get('/videos', {params}).then(({ data }) => {
            const { items} = data;
            return items.length>0;
        }).catch((err) => err);

    }
}