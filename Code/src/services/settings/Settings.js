import {appConfig} from '../../config';

export default class Settings {

    regionCode = appConfig.defaultRegion;
    videoCategoryId = appConfig.defaultCategoryId;
    maxResults = appConfig.maxVideosToLoad;

    get = () => {
        const localSettings = localStorage.getItem('settings');
        const {defaultRegion, defaultCategoryId, maxVideosToLoad} = appConfig;
        return localSettings ? JSON.parse(localSettings) : {
            regionCode: defaultRegion,
            videoCategoryId: defaultCategoryId,
            maxResults: maxVideosToLoad
        };

    }
    ;

    save = ({
                regionCode = this.regionCode,
                videoCategoryId = this.videoCategoryId,
                maxResults = this.maxResults
            }) => {
        this.regionCode = regionCode ? regionCode : void 0;
        this.videoCategoryId = videoCategoryId ? videoCategoryId : void 0;
        this.maxResults = maxResults ? maxResults : void 0;
        localStorage.setItem('settings', JSON.stringify({regionCode, videoCategoryId, maxResults}));
    };
}