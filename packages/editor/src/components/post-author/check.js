/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import PostTypeSupportCheck from '../post-type-support-check';
import { store as editorStore } from '../../store';

/**
 * Wrapper component that renders its children only if the post type supports the author.
 *
 * @param {Object}          props          The component props.
 * @param {React.ReactNode} props.children Children to be rendered.
 *
 * @return {React.ReactNode} The component to be rendered. Return `null` if the post type doesn't
 * supports the author or if there are no authors available.
 */
export default function PostAuthorCheck( { children } ) {
	const { hasAssignAuthorAction } = useSelect( ( select ) => {
		const post = select( editorStore ).getCurrentPost();
		const canAssignAuthor = post?._links?.[ 'wp:action-assign-author' ]
			? true
			: false;
		return {
			hasAssignAuthorAction: canAssignAuthor,
		};
	}, [] );

	if ( ! hasAssignAuthorAction ) {
		return null;
	}

	return (
		<PostTypeSupportCheck supportKeys="author">
			{ children }
		</PostTypeSupportCheck>
	);
}
