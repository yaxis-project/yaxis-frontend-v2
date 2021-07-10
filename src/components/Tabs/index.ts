import { Tabs } from 'antd'
import styled from 'styled-components'

const StyledTabs = styled(Tabs)`
.ant-tabs-nav {
    background: ${(props) => props.theme.secondary.background};
    border: none;

    .ant-tabs-tab {
        border-right: none;

    }
}


`
export default StyledTabs
