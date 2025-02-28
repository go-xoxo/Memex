import React, { PureComponent } from 'react'
import { connect, MapStateToProps } from 'react-redux'

import Button from '../../components/Button'
import { ClickHandler, RootState } from '../../types'
import * as acts from '../actions'
import * as popup from '../../selectors'
import { getKeyboardShortcutsState } from 'src/in-page-ui/keyboard-shortcuts/content_script/detection'

const styles = require('./CollectionsButton.css')
const buttonStyles = require('../../components/Button.css')

export interface OwnProps {
    fetchCollections?: () => Promise<string[]>
}

interface StateProps {
    isDisabled: boolean
}

interface DispatchProps {
    toggleCollectionsPopup: ClickHandler<HTMLButtonElement>
    toggleAllTabsPopup: ClickHandler<HTMLButtonElement>
}

export type Props = OwnProps & StateProps & DispatchProps

class CollectionsButton extends PureComponent<Props> {
    async componentDidMount() {
        await this.getKeyboardShortcutText()
        const hasCollections = await this.props.fetchCollections()

        if (hasCollections.length > 0) {
            this.setState({
                hasCollections: true,
            })
        }
    }

    state = {
        highlightInfo: undefined,
        hasCollections: false,
    }

    private async getKeyboardShortcutText() {
        const {
            shortcutsEnabled,
            addToCollection,
        } = await getKeyboardShortcutsState()

        if (!shortcutsEnabled || !addToCollection.enabled) {
            this.setState({
                highlightInfo: `${addToCollection.shortcut} (disabled)`,
            })
        } else
            this.setState({
                highlightInfo: `${addToCollection.shortcut}`,
            })
    }

    render() {
        return (
            <div className={styles.buttonContainer}>
                <Button
                    onClick={this.props.toggleCollectionsPopup}
                    disabled={this.props.isDisabled}
                    btnClass={
                        this.state.hasCollections
                            ? styles.hasLists
                            : styles.addToList
                    }
                    itemClass={styles.button}
                >
                    <div className={styles.buttonInnerContent}>
                        Add to Spaces
                        <p className={buttonStyles.subTitle}>
                            {this.state.highlightInfo}
                        </p>
                    </div>
                </Button>
            </div>
        )
    }
}

const mapState: MapStateToProps<StateProps, OwnProps, RootState> = (state) => ({
    isDisabled: !popup.isLoggable(state),
})

const mapDispatch = (dispatch): DispatchProps => ({
    toggleCollectionsPopup: (event) => {
        event.preventDefault()
        dispatch(acts.setAllTabs(false))
        dispatch(acts.toggleShowTagsPicker())
    },
    toggleAllTabsPopup: (event) => {
        event.preventDefault()
        dispatch(acts.setAllTabs(true))
        dispatch(acts.toggleShowTagsPicker())
    },
})

export default connect<StateProps, DispatchProps, OwnProps>(
    mapState,
    mapDispatch,
)(CollectionsButton)
