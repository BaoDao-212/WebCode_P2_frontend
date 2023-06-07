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
import { language } from '@codemirror/language';
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
    <div class="flex flex-column">
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
        <Button class="w-50 p-2 m-3" label="Submit" @click="submitCode" outlined />
        <div class="card output-card">
            <h3>Output</h3>
            <div class="output dark-blue">
                <pre>{{ output.stdout }}</pre>
            </div>
        </div>
        <div class="card error-card dark-blue">
            <h3>Error</h3>
            <div class="error-message">
                <pre>{{ output.stderr }}</pre>
            </div>
        </div>
    </div>
</template>

<style>
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

.output-card {
    grid-column: span 1;
}

.output.dark-blue {
    background-color: #8e8c8c;
    color: rgb(24, 48, 124);
    font-weight: bold;
}

.error-card {
    grid-column: span 3;
}

.error-message {
    color: red;
    font-weight: bold;
    background-color: #999595;
}

pre {
    white-space: pre-wrap;
}
</style>
