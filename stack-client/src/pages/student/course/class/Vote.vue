<template>
    <div>
        <empty v-if='item==null'></empty>
        <div v-else class="voteBlock">
            <p style="padding: 2rem 2rem 0;">{{item.content}}</p>
            <div v-if='!isVoted'>
                <a-radio-group v-model="value" @change="onChange" style="margin-bottom: 2rem;">
                    <a-radio :class="value==opt.value?'voteRadio voteActive':'voteRadio'" :key="opt.value"
                        v-for="opt in item.options" :value="opt.value">
                        {{opt.text}}
                    </a-radio>
                </a-radio-group>
                <a-button type="primary" block @click='submitVote'>
                    提交
                </a-button>
            </div>
            <div v-else>
                <a-radio-group v-model="value" @change="onChange" style="margin-bottom: 2rem;" disabled>
                    <a-radio :class="value==opt.value?'voteRadio voteActive':'voteRadio'" :key="opt.value"
                        v-for="opt in item.options" :value="opt.value">
                        {{opt.text}}
                        <a-icon v-if='value==opt.value' type="check" style="color: #00c000;" />
                    </a-radio>
                </a-radio-group>
            </div>
        </div>
    </div>
</template>

<script>
    import empty from '../../../../components/Empty.vue'

    export default {
        components: {
            empty,
        },
        data() {
            return {
                value: '',
                isVoted: false,
                item: {
                    content: 'I love coding because',
                    options: [
                        {
                            value: 'a',
                            text: 'they paid'
                        },
                        {
                            value: 'b',
                            text: 'I am charitable'
                        },
                    ],
                },
                radioStyle: {
                    display: 'block',
                    height: '30px',
                    lineHeight: '30px',
                },
            };
        },
        methods: {
            onChange(e) {
                console.log('radio checked', e.target.value);
                this.value = e.target.value;
            },
            submitVote() {
                this.isVoted = !this.isVoted;
            }
        },
    };
</script>

<style>
    .voteBlock {
        width: 100%;
    }

    .voteRadio {
        display: block;
        width: 100vh;
        min-height: 5rem;
        font-size: 1.8rem;
        margin-top: .5rem;
        padding: 1rem 1rem 0;
        background-color: #f1f1f1;
    }

    .voteActive {
        background-color: #c9eaff;
    }
</style>