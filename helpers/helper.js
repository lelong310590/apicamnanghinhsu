export function sortArrayByParentId(arr, parentId = 0) {
	const result = [];

	for (let i = 0; i < arr.length; i++) {
		if (arr[i].parent_id === parentId) {
			const children = sortArrayByParentId(arr, arr[i].id);

			if (children.length > 0) {
				arr[i].children = children;
			}

			result.push(arr[i]);
		}
	}

	return result;
}