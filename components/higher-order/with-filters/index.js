/**
 * WordPress dependencies
 */
import createHooks from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import wrapperDisplayName from '../wrapper-display-name';

// TODO: Use withHooks HOC from https://github.com/WordPress/gutenberg/pull/3321.
const hooks = createHooks();

export default function withFilters( hookName ) {
	return ( WrappedComponent ) => {
		const FiltersComponent = ( props ) => {
			return hooks.applyFilters( hookName, <WrappedComponent { ...props } />, props );
		};
		FiltersComponent.displayName = wrapperDisplayName( 'filters', WrappedComponent );

		return FiltersComponent;
	};
}

// TODO: Remove. Temporary change to verify it works as expected.
function addFrozenMode( element ) {
	return (
		<div>
			<h1>Frozen!!!</h1>
			{ element }
		</div>
	);
}
hooks.addFilter( 'VisualEditorBlock', 'coediting-frozen-mode', addFrozenMode );
