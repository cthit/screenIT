import {prisma} from 'prisma.js'


export const addImage = async (imgData) => {
	return await prisma.image.create({
		url: imgData.url,
		// 1000 * 60 * 60 * 24 * 7 = 604800000
		validUntil: imgData.validUntil || new Date(Date.now() + 604800000)
	})

}
