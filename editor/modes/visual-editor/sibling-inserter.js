/**
 * External dependencies
 */
import { connect } from 'react-redux';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Inserter } from '../../components';
import {
	getBlockInsertionPoint,
	isBlockInsertionPointVisible,
} from '../../selectors';

class VisualEditorSiblingInserter extends Component {
	constructor() {
		super( ...arguments );

		this.forceVisibleWhileInserting = this.forceVisibleWhileInserting.bind( this );

		this.state = {
			isForcedVisible: false,
		};
	}

	forceVisibleWhileInserting( isOpen ) {
		// Prevent mouseout and blur while navigating the open inserter menu
		// from causing the inserter to be unmounted.
		this.setState( { isForcedVisible: isOpen } );
	}

	render() {
		const { insertIndex, showInsertionPoint } = this.props;
		const { isForcedVisible } = this.state;

		const classes = classnames( 'editor-visual-editor__sibling-inserter', {
			'is-forced-visible': isForcedVisible || showInsertionPoint,
		} );

		return (
			<div
				ref={ this.bindNode }
				data-insert-index={ insertIndex }
				className={ classes }>
				{ showInsertionPoint && (
					<div className="editor-visual-editor__insertion-point" />
				) }
				<Inserter
					key="inserter"
					position="bottom"
					insertIndex={ insertIndex }
					onToggle={ this.forceVisibleWhileInserting }
				/>
			</div>
		);
	}
}

export default connect(
	( state, ownProps ) => {
		return {
			showInsertionPoint: (
				isBlockInsertionPointVisible( state ) &&
				getBlockInsertionPoint( state ) === ownProps.insertIndex
			),
		};
	}
)( VisualEditorSiblingInserter );
