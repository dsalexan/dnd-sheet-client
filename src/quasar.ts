import Vue from 'vue'

import './styles/quasar.styl'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import {
    Quasar,
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    Notify,
    QTooltip,
    QSeparator,
    QSlideItem,
    Ripple,
    QKnob,
    QBtnGroup,
    QDialog,
    QChip,
    QAvatar,
    ClosePopup,
    QCard,
    QCardSection,
    QLinearProgress,
    QSpace,
    QSelect,
    QSpinner,
    QExpansionItem,
    QPopupEdit
} from 'quasar'

Vue.use(Quasar, {
    config: {
        notify: {
            position: 'bottom',
            timeout: 2000,
            textColor: 'white',
        },
    },
    components: {
        QLayout,
        QHeader,
        QDrawer,
        QPageContainer,
        QPage,
        QToolbar,
        QToolbarTitle,
        QBtn,
        QIcon,
        QList,
        QItem,
        QItemSection,
        QItemLabel,
        QTooltip,
        QSeparator,
        QSlideItem,
        QKnob,
        QBtnGroup,
        QDialog,
        QChip,
        QAvatar,
        QCard,
        QCardSection,
        QLinearProgress,
        QSpace,
        QSelect,
        QSpinner,
        QExpansionItem,
        QPopupEdit
    },
    directives: {
        Ripple,
        ClosePopup,
    },
    plugins: {
        Notify,
    },
})
