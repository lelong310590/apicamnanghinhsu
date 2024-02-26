import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Post from 'App/Models/Post'

import ResponseFormat from 'App/utils/ResponseFormat'


export default class PostsController {
    //get all post
    public async getPost({request, response}: HttpContextContract) {
        const categoryId = parseInt(request.input('catId'))
        const page = parseInt(request.input('page', 1))
        const limit = parseInt(request.input('limit', 10))
        const order = request.input('sort', "asc")
        const post = await Post.query()
            .preload('category')
            .select([
                'id', 'name', 'description', 'status', 'author_id', 'image', 'views', 'created_at', 'updated_at', 'type_id',
                'release_date', 'effect_date'
            ])
            .whereHas('category', (query) => {
                query.where('category_id', categoryId)
            }).orderBy('created_at', order).paginate(page, limit)
        if (post.length != 0) {
            return response.status(200).json(
                new ResponseFormat(
                    post,
                    true,
                    "Lấy thông tin post thành công"
                )
            )
        } else {
            return response.status(200).json(
                new ResponseFormat(
                    null,
                    false,
                    "Không tìm thấy thông tin post"
                )
            )
        }
    }

    //controller get Top5 Newset Post By Category
    public async getTop5Post({request, response}: HttpContextContract) {
        const categoryId = parseInt(request.input('catId'))
        const page = parseInt('page', 1)
        const order = request.input('sort', "desc")
        let post:any[] = []
        if (categoryId) {
            post = await Post.query()
                .preload('category')
                .select([
                    'id', 'name', 'description', 'status', 'author_id', 'is_featured',
                    'image', 'views', 'created_at', 'updated_at', 'type_id',
                    'release_date', 'effect_date'
                ])
                .where('is_featured', 1)
                .whereHas('category', (query) => {
                    query.where('category_id', categoryId)
                })
                .limit(5)
                .orderBy('created_at', order)
                .paginate(page, 5)
        } else {
            post = await Post.query()
                .select([
                    'id', 'name', 'description', 'status', 'author_id', 'is_featured',
                    'image', 'views', 'created_at', 'updated_at', 'type_id',
                    'release_date', 'effect_date'
                ])
                .where('is_featured', 1)
                .limit(5)
                .orderBy('created_at', order)
                .paginate(page, 5)
        }

        if (post.length != 0) {
            return response.status(200).json(
                new ResponseFormat(
                    post,
                    true,
                    "Lấy thông tin top 5 post thành công"
                )
            )
        } else {
            return response.status(200).json(
                new ResponseFormat(
                    null,
                    false,
                    "Không tìm thấy thông tin post"
                )
            )
        }
    }

    //get all post by category
    public async getPostsByCategory({request, response}: HttpContextContract) {
        const catId = parseInt(request.input("catId"))
        const page = parseInt(request.input('page', 1))
        const limit = parseInt(request.input('limit', 10))
        const order = request.input('sort', "asc")
        const post = await Post.query()
            .preload('category')
            .preload('author')
            .preload('tag')
            .preload('type')
            .select([
                'id', 'name', 'description', 'status', 'author_id', 'image', 'views', 'created_at', 'updated_at', 'type_id',
                'release_date', 'effect_date'
            ])
            .whereHas('category', (query) => {
            query.where('category_id', catId)
        }).orderBy('created_at', order).paginate(page, limit)
        return response.status(200).json(
            post.length != 0 ?
                new ResponseFormat(
                    post,
                    true,
                    "Lấy thông tin posts thành công"
                ) : new ResponseFormat(
                null,
                false,
                "Không tìm thấy posts phù hợp"
                )
        )
    }

    //get all post by type
    public async getPostsByType({request, response}: HttpContextContract) {
        const typeId = parseInt(request.input('typeId'))
        const page = parseInt(request.input('page', 1))
        const limit = parseInt(request.input('limit', 10))
        const order = request.input('sort', "asc")
        const post = await Post.query()
            .preload('category')
            .preload('author')
            .preload('tag')
            .preload('type')
            .select([
                'id', 'name', 'description', 'status', 'author_id', 'image', 'views', 'created_at', 'updated_at', 'type_id',
                'release_date', 'effect_date'
            ])
            .where('type_id', typeId)
            .orderBy('created_at', order)
            .paginate(page, limit)
        return response.status(200).json(
            post.length != 0 ?
                new ResponseFormat(
                    post,
                    true,
                    "Lấy thông tin posts thành công"
                ) : new ResponseFormat(
                null,
                false,
                "Không tìm thấy posts phù hợp"
                )
        )
    }

    //get all post by Tags
    public async getPostsByTag({request, response}: HttpContextContract) {
        const tagId = parseInt(request.input('tagId'))
        const page = parseInt(request.input('page', 1))
        const limit = parseInt(request.input('limit', 10))
        const order = request.input('sort', "asc")
        const post = await Post.query()
            .preload('category')
            .preload('author')
            .preload('tag')
            .preload('type')
            .select([
                'id', 'name', 'description', 'status', 'author_id', 'image', 'views', 'created_at', 'updated_at', 'type_id',
                'release_date', 'effect_date'
            ])
            .whereHas('tag', (query) => {
                query.where('tag_id', tagId)
            }).orderBy('created_at', order).paginate(page, limit)
        return response.status(200).json(
            post.length != 0 ?
                new ResponseFormat(
                    post,
                    true,
                    "Lấy thông tin posts thành công"
                ) : new ResponseFormat(
                null,
                false,
                "Không tìm thấy posts phù hợp"
                )
        )
    }

    //controller get Post details
    public async getPostDetails({request, response}: HttpContextContract) {
        const postId = parseInt(request.input('postId'))
        const post = await Post.query()
            .preload('author')
            .preload('category')
            .preload('tag')
            .preload('type')
            .select(["*", Database.raw(`(SELECT min(id) from posts where id >${postId}) as next_id, (SELECT max(id) from posts where id <${postId}) as prev_id`)]).where('id', postId)
        if (post.length != 0) {
            return response.status(200).json(
                new ResponseFormat(
                    post,
                    true,
                    "Lấy thông tin post thành công"
                )
            )
        } else {
            return response.status(200).json(
                new ResponseFormat(
                    null,
                    false,
                    "Không tìm thấy thông tin post"
                )
            )
        }
    }

    //get next post
    public async getNextPost({ response, params}: HttpContextContract) {
        const postId = params.id
        const nextPost = await Post.query().preload('author').preload('category').preload('tag').preload('type').select('*').whereRaw(`id = (SELECT min(id) from posts where id > ${postId})`)
        if (nextPost.length != 0) {
            return response.status(200).json(
                new ResponseFormat(
                    nextPost,
                    true,
                    "Get Next post thành công"
                )
            )
        } else {
            return response.status(200).json(
                new ResponseFormat(
                    nextPost,
                    false,
                    "Không get được next post"
                )
            )
        }
    }

    //get previous post
    public async getPreviousPost({response, params}: HttpContextContract) {
        const postId = params.id
        const nextPost = await Post.query().preload('author').preload('category').preload('tag').preload('type').select('*').whereRaw(`id = (SELECT max(id) from posts where id < ${postId})`)
        if (nextPost.length != 0) {
            return response.status(200).json(
                new ResponseFormat(
                    nextPost,
                    true,
                    "Get previous post thành công"
                )
            )
        } else {
            return response.status(200).json(
                new ResponseFormat(
                    nextPost,
                    false,
                    "Không get được previous post"
                )
            )
        }
    }

    //search post
    public async searchPost({request, response}: HttpContextContract) {
        const catId = request.input('catId', null)
        const typeId = request.input('typeId', null)
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)
        const content = request.input('content')
        const order = request.input('sort', "asc")
        const searchType = request.input('searchType', 'normal')
        let searchName = this.removeVietnameseTones(content)
        let searchNameSplit = []
        
        if (searchType === 'advance') {
            searchNameSplit = searchName.split(" ")
        }

        if (catId && typeId) {
            let posts = {}

            if (searchType === 'normal') {
                posts = await Post.query()
                    .preload('category')
                    .select(['id', 'name', 'description', 'status', 'author_id', 'image', 'views', 'created_at', 'updated_at', 'type_id', 'release_date', 'effect_date'])
                    .where('type_id', typeId)
                    .whereHas('category', (query) => {
                        query.where('category_id', catId);
                    })
                    // .whereRaw(`MATCH(name, content) AGAINST (?)`,[content])
                    .whereILike('search_name', `%${searchName}%`)
                    .orderBy('created_at', order)
                    .paginate(page, limit)
            } else if (searchType === 'advance') {
                posts = await Post.query()
                    .if(searchNameSplit.length > 0, (q) => {
                        for (let i = 0; i < searchNameSplit.length; i++) {
                            q.whereILike("search_name", `%${searchNameSplit[i]}%`)
                        }
                    })
                    .preload('category')
                    .select(Database.raw('`id`, `name`, `description`, `content`, `status`, `author_id`, `image`, `views`, `created_at`, `updated_at`, `type_id`, `release_date`, `effect_date`'))
                    .where('type_id', typeId)
                    .whereHas('category', (query) => {
                        query.where('category_id', catId);
                    })

                    .orderBy('created_at', order)
                    .paginate(page, limit)
            }

            return response
                .status(200)
                .json(new ResponseFormat(posts, true, 'Tìm kiếm thành công'));
        }
        if (catId && typeId == null) {
            let posts = {}
            if (searchType === 'normal') {
                posts = await Post.query()
                    .preload('category')
                    .select(['id', 'name', 'description', 'status', 'author_id', 'image', 'views', 'created_at', 'updated_at', 'type_id', 'release_date', 'effect_date'])
                    .whereHas('category', (query) => {
                        query.where('category_id', catId);
                    })
                    // .whereRaw(`MATCH(name, content) AGAINST (?)`,[content])
                    .whereILike('search_name', `%${searchName}%`)
                    .orderBy('created_at', order)
                    .paginate(page, limit);
            } else if (searchType === 'advance') {
                posts = await Post.query()
                    .if(searchNameSplit.length > 0, (q) => {
                        for (let i = 0; i < searchNameSplit.length; i++) {
                            q.whereILike("search_name", `%${searchNameSplit[i]}%`)
                        }
                    })
                    .preload('category')
                    .select(Database.raw('`id`, `name`, `description`, `content`, `status`, `author_id`, `image`, `views`, `created_at`, `updated_at`, `type_id`, `release_date`, `effect_date`'))
                    .whereHas('category', (query) => {
                        query.where('category_id', catId);
                    })
        
                    .orderBy('created_at', order)
                    .paginate(page, limit)
            }

            return response
                .status(200)
                .json(new ResponseFormat(posts, true, 'Tìm kiếm thành công'));
        }
        if (typeId && catId == null) {
            let posts = {}
            if (searchType === 'normal') {
                posts = await Post.query()
                    .preload('type')
                    .select(['id', 'name', 'description', 'status', 'author_id', 'image', 'views', 'created_at', 'updated_at', 'type_id', 'release_date', 'effect_date'])
                    .where('type_id', typeId)
                    // .whereRaw(`MATCH(name, content) AGAINST (?)`,[content])
                    .whereILike('search_name', `%${searchName}%`)
                    .orderBy('created_at', order)
                    .paginate(page, limit);
            } else if (searchType === 'advance') {
                posts = await Post.query()
                    .if(searchNameSplit.length > 0, (q) => {
                        for (let i = 0; i < searchNameSplit.length; i++) {
                            q.whereILike("search_name", `%${searchNameSplit[i]}%`)
                        }
                    })
                    .preload('type')
                    .select(Database.raw('`id`, `name`, `description`, `content`, `status`, `author_id`, `image`, `views`, `created_at`, `updated_at`, `type_id`, `release_date`, `effect_date`'))
                    .where('type_id', typeId)
                    .orderBy('created_at', order)
                    .paginate(page, limit)
            }

            return response
                .status(200)
                .json(new ResponseFormat(posts, true, 'Tìm kiếm thành công'));
        }
        if (catId == null && typeId == null) {
            let posts = {}
            if (searchType === 'normal') {
                posts = await Post.query().select(['id', 'name', 'description', 'status', 'author_id', 'image', 'views', 'created_at', 'updated_at', 'type_id', 'release_date', 'effect_date'])
                    // .whereRaw(`MATCH(name, content) AGAINST (?)`,[content])
                    .whereILike('search_name', `%${searchName}%`)
                    .orderBy('created_at', order).paginate(page, limit)
            } else if (searchType === 'advance') {
                posts = await Post.query()
                    .if(searchNameSplit.length > 0, (q) => {
                        for (let i = 0; i < searchNameSplit.length; i++) {
                            q.whereILike("search_name", `%${searchNameSplit[i]}%`)
                        }
                    })
                    .select(Database.raw('`id`, `name`, `description`, `status`, `author_id`, `image`, `views`, `created_at`, `updated_at`, `type_id`, `release_date`, `effect_date`'))
                    .orderBy('created_at', order)
                    .paginate(page, limit)
                
                return posts
                    
            }

            return response.status(200).json(
                new ResponseFormat(
                    posts,
                    true,
                    'Tìm kiếm thành công',
                )
            )
        }
    }

    private removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    }
}
