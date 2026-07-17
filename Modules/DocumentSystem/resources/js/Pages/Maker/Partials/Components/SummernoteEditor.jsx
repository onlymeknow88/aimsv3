import React, { useEffect, useRef } from 'react';

export default function SummernoteEditor({ value, onChange, placeholder = 'Tulis deskripsi...' }) {
    const textareaRef = useRef(null);

    useEffect(() => {
        // Load dependencies dynamically if not present
        const loadDependencies = async () => {
            if (!window.jQuery) {
                const jqueryScript = document.createElement('script');
                jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
                document.head.appendChild(jqueryScript);
                await new Promise((resolve) => (jqueryScript.onload = resolve));
            }

            if (!document.getElementById('summernote-css')) {
                const link = document.createElement('link');
                link.id = 'summernote-css';
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css';
                document.head.appendChild(link);
            }

            if (!window.summernoteLoaded) {
                const summernoteScript = document.createElement('script');
                summernoteScript.src = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js';
                document.head.appendChild(summernoteScript);
                await new Promise((resolve) => (summernoteScript.onload = resolve));
                window.summernoteLoaded = true;
            }

            // Initialize Summernote
            if (window.jQuery && textareaRef.current) {
                const $el = window.jQuery(textareaRef.current);
                $el.summernote({
                    placeholder: placeholder,
                    tabsize: 2,
                    height: 180,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', ['underline'], 'clear']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link']],
                        ['view', ['codeview']]
                    ],
                    callbacks: {
                        onChange: (contents) => {
                            if (onChange) {
                                onChange(contents);
                            }
                        }
                    }
                });

                // Set initial value
                if (value) {
                    $el.summernote('code', value);
                }
            }
        };

        loadDependencies();

        return () => {
            if (window.jQuery && textareaRef.current) {
                try {
                    window.jQuery(textareaRef.current).summernote('destroy');
                } catch (e) {
                    // Ignore destroy error
                }
            }
        };
    }, []);

    // Sync state changes from outside if modified
    useEffect(() => {
        if (window.jQuery && textareaRef.current) {
            const $el = window.jQuery(textareaRef.current);
            if ($el.summernote('code') !== value) {
                $el.summernote('code', value || '');
            }
        }
    }, [value]);

    return (
        <div className="summernote-wrapper">
            <textarea ref={textareaRef} style={{ display: 'none' }} />
            <style>{`
                .note-editor.note-frame {
                    border: 1px solid var(--border-color) !important;
                    border-radius: 6px !important;
                    overflow: hidden;
                    font-family: inherit;
                }
                .note-toolbar {
                    background-color: #f8fafc !important;
                    border-bottom: 1px solid var(--border-color) !important;
                }
                .note-editable {
                    font-size: 11px !important;
                    color: var(--text-primary) !important;
                }
            `}</style>
        </div>
    );
}
