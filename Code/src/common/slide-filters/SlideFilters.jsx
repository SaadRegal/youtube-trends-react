import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

import './SlideFilters.scss';
import {appConfig} from '../../config';
import Settings from '../../services/settings/Settings';
import {YoutubeService} from '../../services/youtube/Youtube';

const settings = new Settings();
const youtube = new YoutubeService();

const categoriesList = [
    {name: 'Film & Animation', id: 1},
    {name: 'Autos & Vehicles', id: 2},
    {name: 'Music', id: 10},
    {name: 'Pets & Animals', id: 15}
];

const Handle = Slider.Handle;

const handle = (props) => {
    const {value, dragging, index, ...restProps} = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

handle.propTypes = {
    value: PropTypes.number,
    dragging: PropTypes.func,
    index: PropTypes.number
};

function renderInput(inputProps) {
    const {InputProps, ref, ...other} = inputProps;
    return (
        <TextField
            InputProps={{
                inputRef: ref,
                ...InputProps
            }}
            {...other}
        />
    );
}

function renderSuggestion({suggestion, index, itemProps, highlightedIndex, selectedItem}) {
    const isHighlighted = highlightedIndex === index;
    let isSelected = (selectedItem ? selectedItem.name : '').indexOf(suggestion.name) > -1;
    return (
        <MenuItem
            {...itemProps}
            key={suggestion.code || suggestion.id}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 'bold' : 400
            }}
        >
            {suggestion.name}

        </MenuItem>
    );
}

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({name: PropTypes.string, code: PropTypes.string}).isRequired
};


class SlideFilters extends Component {
    /*Using the hardcoded list as fallback*/
    countriesList = appConfig.countryList;
    categoriesList = categoriesList;

    async componentWillMount() {
        this.categoriesList = await youtube.getCategories();
        this.countriesList = await youtube.getCountries();

    }

    countryChange = (selected) => {
        this.props.config.defaultRegion = selected.code;
        settings.save({regionCode: selected.code});
        this.props.onChanges();
    };
    categoryChange = (selected) => {
        this.props.config.defaultCategoryId = selected.id;
        settings.save({videoCategoryId: selected.id});
        this.props.onChanges();
    };

    render() {

        const videosToLoadChange = (val) => {
            this.props.config.maxVideosToLoad = val;
            settings.save({maxResults: val});
            this.props.onChanges();
        };
        return (
            <div className="slide-filters-container">
                <h3 className="title">
                    Filters
                    <Button className="mat-icon-button" onClick={this.props.close}>
                        <CloseIcon aria-label="Close"/>
                    </Button>
                </h3>
                <Downshift id="countrySelect" onChange={this.countryChange}
                           itemToString={item => (item ? item.name : '')}>
                    {({
                          getInputProps,
                          getItemProps,
                          getMenuProps,
                          highlightedIndex,
                          isOpen,
                          selectedItem,
                          inputValue
                      }) => (
                        <div>
                            {renderInput({
                                fullWidth: true,
                                InputProps: getInputProps(),
                                label: 'Select Country'
                            })}
                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper square>
                                        {this.countriesList.filter(item => !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase())).map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({item: suggestion}),
                                                highlightedIndex,
                                                selectedItem
                                            })
                                        )}
                                    </Paper>
                                ) : null}
                            </div>
                        </div>
                    )}
                </Downshift>
                <div className="divider"/>
                <Downshift id="categorySelect" onChange={this.categoryChange}
                           itemToString={item => (item ? item.name : '')}>
                    {({
                          getInputProps,
                          getItemProps,
                          getMenuProps,
                          highlightedIndex,
                          isOpen,
                          selectedItem,
                          inputValue
                      }) => (
                        <div>
                            {renderInput({
                                fullWidth: true,
                                InputProps: getInputProps(),
                                label: 'Select Category'
                            })}
                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper square>
                                        {this.categoriesList.filter(item => !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase())).map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({item: suggestion}),
                                                highlightedIndex,
                                                selectedItem
                                            })
                                        )}
                                    </Paper>
                                ) : null}
                            </div>
                        </div>
                    )}
                </Downshift>
                <div className="divider"/>
                <div className="videosCountPerPage">
                    <div className="caption">Count of videos on the page</div>
                    <div className="slider">
                        <Slider
                            min={1}
                            max={200}
                            defaultValue={this.props.config.maxVideosToLoad}
                            handle={handle}
                            onAfterChange={videosToLoadChange}/>
                    </div>
                </div>
            </div>
        );
    }
}

SlideFilters.propTypes = {
    config: PropTypes.object,
    onChanges: PropTypes.func,
    close: PropTypes.func,
};

export default SlideFilters;
