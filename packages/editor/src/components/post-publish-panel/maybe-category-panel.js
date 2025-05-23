/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import HierarchicalTermSelector from '../post-taxonomies/hierarchical-term-selector';
import { store as editorStore } from '../../store';

function MaybeCategoryPanel() {
	const { hasNoCategory, hasSiteCategories } = useSelect( ( select ) => {
		const postType = select( editorStore ).getCurrentPostType();
		const { canUser, getEntityRecord } = select( coreStore );
		const categoriesTaxonomy = getEntityRecord(
			'root',
			'taxonomy',
			'category'
		);
		const defaultCategoryId = canUser( 'read', {
			kind: 'root',
			name: 'site',
		} )
			? getEntityRecord( 'root', 'site' )?.default_category
			: undefined;
		const defaultCategory = defaultCategoryId
			? getEntityRecord( 'taxonomy', 'category', defaultCategoryId )
			: undefined;
		const postTypeSupportsCategories =
			categoriesTaxonomy &&
			categoriesTaxonomy.types.some( ( type ) => type === postType );
		const categories =
			categoriesTaxonomy &&
			select( editorStore ).getEditedPostAttribute(
				categoriesTaxonomy.rest_base
			);
		const siteCategories = postTypeSupportsCategories
			? !! select( coreStore ).getEntityRecords( 'taxonomy', 'category', {
					exclude: [ defaultCategoryId ],
					per_page: 1,
			  } )?.length
			: false;

		// This boolean should return true if everything is loaded
		// ( categoriesTaxonomy, defaultCategory )
		// and the post has not been assigned a category different than "uncategorized".
		const noCategory =
			!! categoriesTaxonomy &&
			!! defaultCategory &&
			postTypeSupportsCategories &&
			( categories?.length === 0 ||
				( categories?.length === 1 &&
					defaultCategory?.id === categories[ 0 ] ) );

		return {
			hasNoCategory: noCategory,
			hasSiteCategories: siteCategories,
		};
	}, [] );

	const [ shouldShowPanel, setShouldShowPanel ] = useState( false );
	useEffect( () => {
		// We use state to avoid hiding the panel if the user edits the categories
		// and adds one within the panel itself (while visible).
		if ( hasNoCategory ) {
			setShouldShowPanel( true );
		}
	}, [ hasNoCategory ] );

	// We only want to show the category panel:
	// if the post type supports categories,
	// if the site has categories other than the default category,
	// and if the post has no other categories than the default category.
	if ( ! shouldShowPanel || ! hasSiteCategories ) {
		return null;
	}

	const panelBodyTitle = [
		__( 'Suggestion:' ),
		<span className="editor-post-publish-panel__link" key="label">
			{ __( 'Assign a category' ) }
		</span>,
	];

	return (
		<PanelBody initialOpen={ false } title={ panelBodyTitle }>
			<p>
				{ __(
					'Categories provide a helpful way to group related posts together and to quickly tell readers what a post is about.'
				) }
			</p>
			<HierarchicalTermSelector slug="category" />
		</PanelBody>
	);
}

export default MaybeCategoryPanel;
