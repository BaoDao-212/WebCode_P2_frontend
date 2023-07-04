<script>
import { defineComponent, reactive, ref } from 'vue';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState } from '@codemirror/state';
import { completeFromList } from '@codemirror/autocomplete';
import { Codemirror } from 'vue-codemirror';
import { useCodeStore } from '@/stores/code.ts';
export default defineComponent({
    components: {
        Codemirror
    },
    props: {
        language: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const code = ref(`//IDE code`);

        const extensions = ref();
        const autocomplete = ref();
        if (props.language == 'Java') {
            code.value += `
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, world!");
  }
}`;
            extensions.value = [java(), oneDark];
            autocomplete.value = ['public', 'class', 'void', 'main', 'System', 'out', 'println'];
        } else if (props.language == 'Python') {
            extensions.value = [python(), oneDark];
            autocomplete.value = ['print', 'range', 'len'];
        } else if (props.language == 'Cpp') {
            extensions.value = [cpp(), oneDark];
            autocomplete.value = ['cout', 'cin', 'vector'];
            code.value += `
#include <iostream>
int main() {
    std::cout << "Hello, world!" << std::endl;
    return 0;
}
`;
        }
        const editorOptions = {
            extraKeys: {
                'Ctrl-Space': 'autocomplete'
            }
        };
        const output = ref('');

        const setupAutocomplete = (editorView) => {
            const autocomplete = editorView.state.facet(EditorState.autocompletion);
            editorView.dispatch({
                effects: autocomplete.update({
                    override: [completeFromList(autocomplete.value)]
                })
            });
        };

        const submitCode = async () => {
            const res = reactive({
                code: encodeURIComponent(code.value),
                inputArray: [],
                inputString: '',
                language: props.language
            });
            const useCode = useCodeStore();
            output.value = await useCode.runCode(res);
        };

        const log = (...args) => {
            console.log(...args);
        };

        return {
            code,
            extensions,
            editorOptions,
            setupAutocomplete,
            output,
            submitCode,
            autocomplete,
            log
        };
    }
});
</script>
<template>
    <Codemirror
        v-model="code"
        placeholder="Code goes here..."
        :style="{ height: '400px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        :options="editorOptions"
        @change="log('change', $event)"
        @focus="log('focus', $event)"
        @blur="log('blur', $event)"
    />
</template>

<style lang="less" scoped>
.language-select {
    margin-bottom: 10px;
}

.output {
    margin-top: 10px;
    background-color: #f5f5f5;
    padding: 10px;
}
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
}

.card {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #999595;
}

.input-card {
    grid-column: span 2;
}

pre {
    white-space: pre-wrap;
}
</style>
