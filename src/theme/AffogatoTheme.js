import colors from './colors'

let CustomTheme = {
    buttons: {
        primary: {
            color: colors.white.base,
            backgroundColor: colors.brown.base,
            // use css custom props
            '--main-color': colors.brown.base,
            '--contrast-color': colors.white.base,
        },
        danger: {
            '--main-color': colors.red.base,
            '--contrast-color': colors.red.contrast,
        },
        custom: {
            color: colors.white.base,
            backgroundColor: colors.brown.light,
            // use css custom props
            '--main-color': '#B4600B',
            '--contrast-color': colors.white.base,
        },
        gray:{
            color: colors.black.base,
            backgroundColor: colors.gray.base,
            // use css custom props
            '--main-color': colors.gray.base,
            '--contrast-color': colors.black.base,
        }                
    },
    headings: {
        h4: {
            color: colors.brown.base        
        }    
    }
        
}

export default CustomTheme