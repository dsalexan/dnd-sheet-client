<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
        <q-toolbar>
            <q-btn
                flat
                dense
                round
                @click="leftDrawerOpen = !leftDrawerOpen"
                aria-label="Menu"
                icon="menu"
                class="q-mr-sm"
                />

            <q-separator dark vertical inset />

            <q-toolbar-title>May</q-toolbar-title>
        </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
            <q-list>
                <q-item-label header>Navigation</q-item-label>
                <q-item to="/" exact>
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Home</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item to="/about" exact>
                    <q-item-section avatar>
                        <q-icon name="info" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>About</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item to="/sheet" exact>
                    <q-item-section avatar>
                        <q-icon name="assignment" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Sheet</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item-label header>Essential Links</q-item-label>

                <!-- <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
                <q-item-section avatar>
                    <q-icon name="school" />
                </q-item-section>
                <q-item-section>
                    <q-item-label>Docs</q-item-label>
                    <q-item-label caption>quasar.dev</q-item-label>
                </q-item-section>
                </q-item>-->
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
export default {
    name: 'LayoutDefault',

    data() {
        return {
            leftDrawerOpen: this.$q.platform.is.desktop
        };
    }
};
</script>
