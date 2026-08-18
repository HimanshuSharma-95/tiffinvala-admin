export type CompressImageOptions = {
    maxWidth?: number
    quality?: number
}

const getImageDimensions = (
    file: File
): Promise<{
    width: number
    height: number
}> => {

    return new Promise(
        (resolve, reject) => {

            const url =
                URL.createObjectURL(file)

            const img =
                new Image()

            img.onload = () => {

                URL.revokeObjectURL(url)

                resolve({
                    width: img.width,
                    height: img.height
                })
            }

            img.onerror = () => {

                URL.revokeObjectURL(url)

                reject(
                    new Error(
                        'Could not decode image'
                    )
                )
            }

            img.src = url
        }
    )
}


const convertHeicToJpeg = async (
    file: File
): Promise<File> => {

    const heic2any =
        (
            await import('heic2any')
        ).default

    const result =
        await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.95
        })

    const blob =
        Array.isArray(result)
            ? result[0]
            : result

    return new File(
        [blob],
        'delivery-proof.jpg',
        {
            type: 'image/jpeg',
            lastModified: Date.now()
        }
    )
}


export const compressImage = async (
    file: File,
    options: CompressImageOptions = {}
): Promise<File> => {

    const maxWidth =
        options.maxWidth ?? 1200

    const quality =
        options.quality ?? 0.5


    /*
     * Detect HEIC / HEIF
     */

    const isHeic =
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        /\.(heic|heif)$/i.test(
            file.name
        )


    let workingFile =
        file


    /*
     * Convert HEIC → JPEG
     */

    if (isHeic) {

        workingFile =
            await convertHeicToJpeg(
                file
            )
    }


    /*
     * Get dimensions
     */

    const {
        width: originalWidth,
        height: originalHeight
    } =
        await getImageDimensions(
            workingFile
        )


    /*
     * Calculate new dimensions
     */

    let width =
        originalWidth

    let height =
        originalHeight


    if (
        width > maxWidth
    ) {

        height =
            (
                height *
                maxWidth
            ) / width

        width =
            maxWidth
    }


    /*
     * Create canvas
     */

    const canvas =
        document.createElement(
            'canvas'
        )


    canvas.width =
        Math.round(width)

    canvas.height =
        Math.round(height)


    const ctx =
        canvas.getContext(
            '2d'
        )


    if (!ctx) {

        throw new Error(
            'Could not create canvas'
        )
    }


    /*
     * Draw image
     */

    const imageUrl =
        URL.createObjectURL(
            workingFile
        )


    const img =
        new Image()


    await new Promise<void>(
        (resolve, reject) => {

            img.onload = () => {

                URL.revokeObjectURL(
                    imageUrl
                )

                resolve()
            }

            img.onerror = () => {

                URL.revokeObjectURL(
                    imageUrl
                )

                reject(
                    new Error(
                        'Could not load image'
                    )
                )
            }

            img.src =
                imageUrl
        }
    )


    ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
    )


    /*
     * Convert canvas → JPEG
     */

    const blob =
        await new Promise<Blob | null>(
            resolve => {

                canvas.toBlob(
                    resolve,
                    'image/jpeg',
                    quality
                )
            }
        )


    if (!blob) {

        throw new Error(
            'Image compression failed'
        )
    }


    /*
     * Return compressed File
     */

    return new File(
        [blob],
        'delivery-proof.jpg',
        {
            type: 'image/jpeg',
            lastModified: Date.now()
        }
    )
}