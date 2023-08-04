import { createMuiTheme } from '@material-ui/core/styles'


const MainTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#3A476a',
            light: '#757ce8',
            dark: '#002884',
        },
        secondary: {
            main: '#b5dae6',
            light: '#33bfff',
            dark: '#007bb2',
        },
        applicationBar:{
            main: '#161b28'
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography:{
        fontFamily: 'Nunito'
    }
})

export default MainTheme;
